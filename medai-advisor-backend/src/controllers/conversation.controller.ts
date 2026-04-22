import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST /api/v1/conversations
export const createConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        user_id: req.userId!,
        title: title || null,
      },
    });

    res.status(201).json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
      },
    });
  } catch (error) {
    console.error('CreateConversation Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};

// GET /api/v1/conversations
export const listConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    const conversations = await prisma.conversation.findMany({
      where: { user_id: req.userId! },
      orderBy: { updated_at: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: { content: true },
        },
      },
    });

    const hasMore = conversations.length > limit;
    const items = conversations.slice(0, limit);

    res.json({
      items: items.map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        lastMessagePreview: c.messages[0]?.content?.slice(0, 100) || null,
      })),
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    console.error('ListConversations Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};

// GET /api/v1/conversations/:conversationId
export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.conversationId, user_id: req.userId! },
    });

    if (!conversation) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: '会话不存在' } });
      return;
    }

    res.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
      },
    });
  } catch (error) {
    console.error('GetConversation Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};

// PATCH /api/v1/conversations/:conversationId
export const updateConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'title 不能为空' } });
      return;
    }

    const existing = await prisma.conversation.findFirst({
      where: { id: req.params.conversationId, user_id: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: '会话不存在' } });
      return;
    }

    const conversation = await prisma.conversation.update({
      where: { id: req.params.conversationId },
      data: { title },
    });

    res.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        updatedAt: conversation.updated_at,
      },
    });
  } catch (error) {
    console.error('UpdateConversation Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};

// DELETE /api/v1/conversations/:conversationId
export const deleteConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await prisma.conversation.findFirst({
      where: { id: req.params.conversationId, user_id: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: '会话不存在' } });
      return;
    }

    await prisma.conversation.delete({ where: { id: req.params.conversationId } });

    res.json({ ok: true });
  } catch (error) {
    console.error('DeleteConversation Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};
