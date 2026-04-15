# AI Prompt Library (MERN + Redis + Docker)

## Objective
This application is a prompt management library for AI prompts. Users can:
- browse saved prompts
- create new prompts
- open one prompt to view full details
- track view counts using Redis
- manage ownership (my prompts + owner-only delete)

This README follows the same assignment spirit as the provided reference document, implemented in **MERN stack**.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express (MVC structure)
- Database: MongoDB (Mongoose)
- Cache/Counter Store: Redis
- Containerization: Docker + Docker Compose

## Environment Prerequisites
- Node.js + npm
- Docker + Docker Compose
- Git
- Internet access (for Mongo Atlas if using cloud URI)

## Project Structure
```text
project/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── controllers/
│   │   └── promptController.js
│   ├── middleware/
│   │   └── validationMiddleware.js
│   ├── models/
│   │   └── Prompt.js
│   ├── routes/
│   │   └── promptRoutes.js
│   ├── seedDemoPrompts.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/userIdentity.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env
└── README.md
```

## Backend Features (MERN Equivalent)
- Stores prompts in MongoDB.
- Provides assignment-style APIs:
  - `GET /api/prompts/`
  - `POST /api/prompts/`
  - `GET /api/prompts/:id`
- Additional API:
  - `DELETE /api/prompts/:id` (owner-only)
- Increments Redis counter when fetching a single prompt.
- Returns `view_count` in prompt detail response.

## Prompt Data Model
`Prompt` schema fields:
- `title` (String, required, min length 3)
- `content` (String, required, min length 20)
- `complexity` (Number, 1-10)
- `createdBy` (String, creator identity)
- `createdAt` (Date auto-generated)

## Backend Validation Rules
- Title must be at least 3 characters.
- Content must be at least 20 characters.
- Complexity must be between 1 and 10.
- User identity header must exist for create/delete flows.

## API Endpoints
Base URL: `http://localhost:5000/api/prompts`

- `GET /`
  - Returns all prompts (`_id`, `title`, `complexity`, `createdAt`, `createdBy`).
- `POST /`
  - Creates prompt with validation.
  - Uses `x-user-email` header to set creator identity.
- `GET /:id`
  - Returns one prompt with full content.
  - Increments Redis key `prompt:{id}:views`.
  - Returns `view_count`.
- `DELETE /:id`
  - Deletes prompt only if requester is the owner.

## Redis Counter Logic
- Key format: `prompt:{id}:views`
- Operation: `INCR` on detail fetch.
- Redis is the source of truth for view counts.
- If Redis is unavailable, API still works and returns fallback `view_count: 0`.

## Frontend Features
- Authentication UI with:
  - Login
  - Create Account (`name`, `email`, `password`)
  - Built-in test account
- Pages:
  - `Library` (all prompts)
  - `My Prompts` (only prompts created by logged-in user)
  - `Prompt Detail`
  - `Add Prompt`
- Form validation for prompt creation.
- Owner-only delete buttons (list + detail).
- Complexity color badges:
  - 1-3 = green
  - 4-7 = orange
  - 8-10 = red
- UI enhancements:
  - Poppins font (Google Fonts)
  - Font Awesome icons

## Frontend Routes
- `/` -> login/create account screen
- `/library` -> all prompts
- `/my-prompts` -> prompts created by current user
- `/prompts/:id` -> prompt detail
- `/add` -> create prompt

Compatibility aliases:
- `/prompts` -> redirects to `/library`
- `/add-prompt` -> redirects to `/add`

## Docker Setup
Run full stack:
```bash
docker-compose up --build
```

Services:
- frontend: `http://localhost:5173`
- backend: `http://localhost:5000`
- mongo: `localhost:27017`
- redis: `localhost:6379`

## Local Setup (Without Docker)
Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend API URL is configured via env:
- `frontend/.env`
- key: `VITE_API_BASE_URL` (example: `http://localhost:5000/api`)

## Demo Prompt Seeding
Seed demo prompts into MongoDB:
```bash
cd backend
npm run seed
```

## End-to-End Test Checklist
- Login with test account or create your own account.
- Open `Library` and verify prompts are listed.
- Create a new prompt.
- Open prompt detail and check `view_count`.
- Refresh detail page and verify `view_count` increments.
- Confirm `My Prompts` only shows your created prompts.
- Delete your own prompt and verify others cannot be deleted by you.
- Restart app and verify prompt data persists in MongoDB.
- Redis view counters reset when Redis restarts (expected unless persisted).

## Notes and Trade-offs
- Authentication is simplified (localStorage-based) for assignment/demo purposes.
- Redis counters are independent from Mongo prompt documents.
- The architecture is beginner-friendly but follows clean backend separation:
  model -> controller -> route -> middleware.
