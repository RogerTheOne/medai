import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, redirectUri } = req.body;

    // 1. 基础校验
    if (!code || !redirectUri) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "缺少 code 或 redirectUri 参数"
        }
      });
      return;
    }

    // 2. 动态初始化 OAuth2Client (因为需要用到前端传来的 redirectUri)
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // 3. Code 换取 Token (token exchange)
    let tokens;
    try {
      const response = await oAuth2Client.getToken(code);
      tokens = response.tokens;
    } catch (error) {
      res.status(502).json({
        error: { code: "UPSTREAM_ERROR", message: "Google token exchange 失败" }
      });
      return;
    }

    if (!tokens.id_token) {
      res.status(502).json({
        error: { code: "UPSTREAM_ERROR", message: "未获取到 Google id_token" }
      });
      return;
    }

    // 4. 验证 id_token 并解析用户信息
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      res.status(502).json({
        error: { code: "UPSTREAM_ERROR", message: "Google 用户信息不完整" }
      });
      return;
    }

    const { sub: google_sub, email, name, picture } = payload;

    // 5. 数据库 Upsert 用户 (存在则更新，不存在则创建)
    const user = await prisma.user.upsert({
      where: { google_sub },
      update: {
        name: name || null,
        avatar_url: picture || null,
      },
      create: {
        google_sub,
        email,
        name: name || null,
        avatar_url: picture || null,
      },
    });

    // 6. 签发系统专属 JWT (accessToken)
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } // MVP 阶段暂定 7 天有效期
    );

    // 7. 返回结果给前端
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      accessToken
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "服务器内部错误" }
    });
  }
};