import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/v1/conversations/:conversationId/messages
export const listMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 50);
    const cursor = req.query.cursor as string | undefined;

    // 验证会话归属
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, user_id: req.userId! },
    });

    if (!conversation) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: '会话不存在' } });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: 'asc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = messages.length > limit;
    const items = messages.slice(0, limit);

    res.json({
      items: items.map((m) => ({
        id: m.id,
        conversationId: m.conversation_id,
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
      })),
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    console.error('ListMessages Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};
