import express from 'express';
import cors from 'cors';
import { googleLogin } from './controllers/auth.controller';

const app = express();

// 中间件
app.use(cors());
app.use(express.json()); // 解析 JSON body

// Auth 路由
app.post('/api/v1/auth/google', googleLogin);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MedAI Backend is running on http://localhost:${PORT}`);
});