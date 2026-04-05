# MedAI Advisor

AI 驱动 医疗咨询   Google 登录  AI 聊天  附近药店查询。

## 技术栈

| 层       | 技术                                      |
| -------- | ----------------------------------------- |
| 前端     | React 19 + TypeScript + Vite + TailwindCSS |
| 后端     | Express 5 + TypeScript + Prisma 7 ORM     |
| 数据库   | SQLite（开发） / PostgreSQL（生产）        |
| 认证     | Google OAuth 2.0 + JWT                    |
| AI       | OpenAI API                                |
| 地图     | Google Places API (New)                   |

## 项目结构

```
medai/
├── frontend/                       # React 前端（脚手架已搭建）
│   └── src/
├── medai-advisor-backend/           # Express 后端
│   ├── src/
│   │   ├── index.ts                # 入口 & 路由挂载
│   │   ├── lib/
│   │   │   └── prisma.ts           # Prisma 客户端单例
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT 认证中间件
│   │   │   └── error.middleware.ts  # 全局错误处理
│   │   └── controllers/
│   │       ├── auth.controller.ts         # Google 登录 & /me
│   │       ├── conversation.controller.ts # 会话 CRUD
│   │       ├── message.controller.ts      # 消息列表
│   │       ├── chat.controller.ts         # AI 聊天（非流式 + SSE 流式）
│   │       └── pharmacy.controller.ts     # 附近药店查询
│   └── prisma/
│       └── schema.prisma            # 数据库模型
└── .env                             # 环境变量（不提交）
```

当前

后端 — 接口 完成

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/health` | GET | 健康检查（公开） |
| `/api/v1/auth/google` | POST | Google 登录（公开） |
| `/api/v1/auth/me` | GET | 获取当前用户 |
| `/api/v1/conversations` | POST | 创建会话 |
| `/api/v1/conversations` | GET | 会话列表（游标分页） |
| `/api/v1/conversations/:id` | GET | 会话详情 |
| `/api/v1/conversations/:id` | PATCH | 修改会话标题 |
| `/api/v1/conversations/:id` | DELETE | 删除会话 |
| `/api/v1/conversations/:id/messages` | GET | 消息列表（游标分页） |
| `/api/v1/chat/send` | POST | AI 聊天（非流式） |
| `/api/v1/chat/stream` | POST | AI 聊天（SSE 流式） |
| `/api/v1/pharmacies/nearby` | GET | 附近药店查询 |

- [x] 数据库建模 & 迁移（Prisma 7 + SQLite）
- [x] JWT 认证中间件
- [x] 全局错误处理中间件
- [x] Google OAuth 登录（code → token → upsert → JWT）
- [x] 会话 CRUD（创建/列表/详情/改标题/删除）
- [x] 消息历史列表
- [x] AI 聊天 — 非流式（调用 OpenAI + 保存消息）
- [x] AI 聊天 — SSE 流式推送
- [x] 附近药店查询（Google Places API New）


## 本地运行

```bash
# 后端
cd medai-advisor-backend
npm install
npx prisma generate
npm run dev

# 前端
cd frontend
npm install
npm run dev
```

## 环境变量

在 `medai-advisor-backend/` 目录下创建 `.env`：

```
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID="你的_CLIENT_ID"
GOOGLE_CLIENT_SECRET="你的_CLIENT_SECRET"
JWT_SECRET="你的_JWT_SECRET"
OPENAI_API_KEY="你的_OPENAI_API_KEY"
OPENAI_MODEL="gpt-4o-mini"
GOOGLE_PLACES_API_KEY="你的_GOOGLE_PLACES_API_KEY"
```