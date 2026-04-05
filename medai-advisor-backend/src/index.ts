import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { googleLogin, getMe } from './controllers/auth.controller';
import { createConversation, listConversations, getConversation, updateConversation, deleteConversation } from './controllers/conversation.controller';
import { listMessages } from './controllers/message.controller';
import { chatSend, chatStream } from './controllers/chat.controller';
import { nearbyPharmacies } from './controllers/pharmacy.controller';
import { requireAuth } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// 中间件
app.use(cors());
app.use(express.json()); // 解析 JSON body

// ===== 公开路由 =====
app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
app.post('/api/v1/auth/google', googleLogin);

// ===== 受保护路由（需要 JWT） =====
app.get('/api/v1/auth/me', requireAuth, getMe);

// 会话
app.post('/api/v1/conversations', requireAuth, createConversation);
app.get('/api/v1/conversations', requireAuth, listConversations);
app.get('/api/v1/conversations/:conversationId', requireAuth, getConversation);
app.patch('/api/v1/conversations/:conversationId', requireAuth, updateConversation);
app.delete('/api/v1/conversations/:conversationId', requireAuth, deleteConversation);

// 消息
app.get('/api/v1/conversations/:conversationId/messages', requireAuth, listMessages);

// AI 聊天
app.post('/api/v1/chat/send', requireAuth, chatSend);
app.post('/api/v1/chat/stream', requireAuth, chatStream);

// 附近药店
app.get('/api/v1/pharmacies/nearby', requireAuth, nearbyPharmacies);

// 全局错误处理（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MedAI Backend is running on http://localhost:${PORT}`);
});