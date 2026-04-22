# MedAI Advisor

An AI-powered medical consultation assistant with Google login, AI chat, and nearby pharmacy search.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + TypeScript + Vite + TailwindCSS |
| Backend | Express 5 + TypeScript + Prisma 7 ORM |
| Database | SQLite (development) / PostgreSQL (production) |
| Authentication | Google OAuth 2.0 + JWT |
| AI | OpenAI API |
| Maps | Google Places API (New) |

## Project Structure

```text
medai/
|-- frontend/                         # React frontend (scaffolded)
|   `-- src/
|-- medai-advisor-backend/            # Express backend
|   |-- src/
|   |   |-- index.ts                  # App entry and route mounting
|   |   |-- lib/
|   |   |   `-- prisma.ts             # Prisma client singleton
|   |   |-- middleware/
|   |   |   |-- auth.middleware.ts    # JWT auth middleware
|   |   |   `-- error.middleware.ts   # Global error handler
|   |   `-- controllers/
|   |       |-- auth.controller.ts          # Google login and /me
|   |       |-- conversation.controller.ts  # Conversation CRUD
|   |       |-- message.controller.ts       # Message list
|   |       |-- chat.controller.ts          # AI chat (non-stream + SSE stream)
|   |       `-- pharmacy.controller.ts      # Nearby pharmacy search
|   `-- prisma/
|       `-- schema.prisma             # Database schema
`-- .env                              # Environment variables (not committed)
```

## Current Progress

### Backend API Status: Completed

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/v1/health` | GET | Health check (public) |
| `/api/v1/auth/google` | POST | Google login (public) |
| `/api/v1/auth/me` | GET | Get current user |
| `/api/v1/conversations` | POST | Create conversation |
| `/api/v1/conversations` | GET | List conversations (cursor pagination) |
| `/api/v1/conversations/:id` | GET | Get conversation details |
| `/api/v1/conversations/:id` | PATCH | Update conversation title |
| `/api/v1/conversations/:id` | DELETE | Delete conversation |
| `/api/v1/conversations/:id/messages` | GET | List messages (cursor pagination) |
| `/api/v1/chat/send` | POST | AI chat (non-streaming) |
| `/api/v1/chat/stream` | POST | AI chat (SSE streaming) |
| `/api/v1/pharmacies/nearby` | GET | Nearby pharmacy search |

- [x] Database modeling and migration (Prisma 7 + SQLite)
- [x] JWT authentication middleware
- [x] Global error middleware
- [x] Google OAuth login (code -> token -> upsert -> JWT)
- [x] Conversation CRUD (create/list/detail/update/delete)
- [x] Message history list
- [x] AI chat - non-streaming (OpenAI call + message persistence)
- [x] AI chat - SSE streaming
- [x] Nearby pharmacy search (Google Places API New)

## Run Locally

```bash
# Backend
cd medai-advisor-backend
npm install
npx prisma generate
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file under `medai-advisor-backend/`:

```env
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
JWT_SECRET="YOUR_JWT_SECRET"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
OPENAI_MODEL="gpt-4o-mini"
GOOGLE_PLACES_API_KEY="YOUR_GOOGLE_PLACES_API_KEY"
```