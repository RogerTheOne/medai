# MedAI Advisor

AI 驱动的医疗咨询助手 — Google 登录 + AI 聊天 + 附近药店查询。

## 技术栈

| 层       | 技术                                      |
| -------- | ----------------------------------------- |
| 前端     | React 19 + TypeScript + Vite + TailwindCSS |
| 后端     | Express 5 + TypeScript + Prisma ORM       |
| 数据库   | SQLite（开发） / PostgreSQL（生产）        |
| 认证     | Google OAuth 2.0 + JWT                    |
| AI       | OpenAI API                                |
| 地图     | Google Places API                         |

## 项目结构

                 
medai/
├── frontend/              # React 前端
│   └── src/
├── medai-advisor-backend/  # Express 后端
│   ├── src/
│   │   ├── index.ts              # 入口 & 路由挂载
│   │   └── controllers/
│   │       └── auth.controller.ts # Google 登录
│   └── prisma/
│       └── schema.prisma          # 数据库模型
└── .env                   # 环境变量（不提交）
```

## 当前进度

已完成
项目初始化（前后端脚手架搭建）
 数据库建模（Prisma Schema：users / conversations / messages）
数据库迁移（SQLite 已生成初始迁移）
Google 登录接口 `POST /api/v1/auth/google`（code 换 token → 验证 → upsert 用户 → 签发 JWT）



本地运行

bash
# 后端
cd medai-advisor-backend
npm install
npx prisma migrate dev
npx ts-node-dev src/index.ts

# 前端
cd frontend
npm install
npm run dev
···········

## 环境变量

在根目录创建 `.env`：
···········
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID="CLIENT_ID"
GOOGLE_CLIENT_SECRET="CLIENT_SECRET"
JWT_SECRET="JWT_SECRET"
··············