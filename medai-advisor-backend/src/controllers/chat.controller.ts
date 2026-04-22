import { Request, Response } from 'express';
import OpenAI from 'openai';
import prisma from '../lib/prisma';

const SYSTEM_PROMPT = `You are MedAI Advisor, an AI-powered medical consultation assistant. You provide general health information only — never diagnose or prescribe.

Your response MUST be in Markdown format with exactly these 5 sections in order:

### Possible Causes
List possible causes based on the symptoms described.

### Follow-up Questions
Ask clarifying questions to better understand the condition.

### General Advice
Provide general self-care or lifestyle advice.

### When to Seek Medical Attention
Clearly state situations where the user should see a doctor or go to emergency.

### Disclaimer
Always include: "This is AI-generated general health information, not a medical diagnosis. Always consult a qualified healthcare professional for medical advice."`;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_MESSAGES = 20;

function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// POST /api/v1/chat/send (非流式)
export const chatSend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, message, metadata } = req.body;

    // 验证 message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'message 不能为空' } });
      return;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `message 超过 ${MAX_MESSAGE_LENGTH} 字符限制` } });
      return;
    }

    let convId = conversationId;

    // 如果没有 conversationId，自动创建会话
    if (!convId) {
      const conv = await prisma.conversation.create({
        data: {
          user_id: req.userId!,
          title: message.slice(0, 50),
        },
      });
      convId = conv.id;
    } else {
      // 验证会话归属
      const existing = await prisma.conversation.findFirst({
        where: { id: convId, user_id: req.userId! },
      });
      if (!existing) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: '会话不存在' } });
        return;
      }
    }

    // 保存用户消息
    const userMessage = await prisma.message.create({
      data: {
        conversation_id: convId,
        role: 'user',
        content: message.trim(),
      },
    });

    // 取最近的历史消息作为上下文
    const history = await prisma.message.findMany({
      where: { conversation_id: convId },
      orderBy: { created_at: 'desc' },
      take: MAX_CONTEXT_MESSAGES,
    });

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.reverse().map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // 调用 OpenAI
    let aiContent: string;
    try {
      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: chatMessages,
      });
      aiContent = completion.choices[0]?.message?.content || '抱歉，未能生成回复。';
    } catch (error) {
      console.error('OpenAI Error:', error);
      res.status(502).json({ error: { code: 'UPSTREAM_ERROR', message: 'LLM 调用失败' } });
      return;
    }

    // 保存 AI 回复
    const assistantMessage = await prisma.message.create({
      data: {
        conversation_id: convId,
        role: 'assistant',
        content: aiContent,
      },
    });

    // 更新会话时间
    const conversation = await prisma.conversation.update({
      where: { id: convId },
      data: { updated_at: new Date() },
    });

    res.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        updatedAt: conversation.updated_at,
      },
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.created_at,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        createdAt: assistantMessage.created_at,
      },
    });
  } catch (error) {
    console.error('ChatSend Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};

// POST /api/v1/chat/stream (SSE 流式)
export const chatStream = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'message 不能为空' } });
      return;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `message 超过 ${MAX_MESSAGE_LENGTH} 字符限制` } });
      return;
    }

    let convId = conversationId;

    if (!convId) {
      const conv = await prisma.conversation.create({
        data: {
          user_id: req.userId!,
          title: message.slice(0, 50),
        },
      });
      convId = conv.id;
    } else {
      const existing = await prisma.conversation.findFirst({
        where: { id: convId, user_id: req.userId! },
      });
      if (!existing) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: '会话不存在' } });
        return;
      }
    }

    // 保存用户消息
    const userMessage = await prisma.message.create({
      data: {
        conversation_id: convId,
        role: 'user',
        content: message.trim(),
      },
    });

    // 设置 SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 发送 conversation 事件
    const conv = await prisma.conversation.findUnique({ where: { id: convId } });
    res.write(`event: conversation\ndata: ${JSON.stringify({ conversationId: convId, title: conv?.title })}\n\n`);

    // 取历史上下文
    const history = await prisma.message.findMany({
      where: { conversation_id: convId },
      orderBy: { created_at: 'desc' },
      take: MAX_CONTEXT_MESSAGES,
    });

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.reverse().map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // 创建 AI 消息占位
    const assistantMessage = await prisma.message.create({
      data: {
        conversation_id: convId,
        role: 'assistant',
        content: '',
      },
    });

    // 发送 message_id 事件
    res.write(`event: message_id\ndata: ${JSON.stringify({ userMessageId: userMessage.id, assistantMessageId: assistantMessage.id })}\n\n`);

    // 流式调用 OpenAI
    let fullContent = '';
    try {
      const openai = getOpenAIClient();
      const stream = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: chatMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          fullContent += text;
          res.write(`event: delta\ndata: ${JSON.stringify({ text })}\n\n`);
        }
      }
    } catch (error) {
      console.error('OpenAI Stream Error:', error);
      res.write(`event: error\ndata: ${JSON.stringify({ code: 'UPSTREAM_ERROR', message: 'LLM 调用失败' })}\n\n`);
      res.end();
      return;
    }

    // 更新 AI 消息内容
    await prisma.message.update({
      where: { id: assistantMessage.id },
      data: { content: fullContent },
    });

    // 更新会话时间
    await prisma.conversation.update({
      where: { id: convId },
      data: { updated_at: new Date() },
    });

    // 发送 done 事件
    res.write(`event: done\ndata: ${JSON.stringify({ ok: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('ChatStream Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ code: 'INTERNAL_ERROR', message: '服务器内部错误' })}\n\n`);
      res.end();
    }
  }
};
