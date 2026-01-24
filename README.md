# Web Forum

**Name:** Obula Saravanakumar Sahishnu Kumaar

**Deployed Website:** [forum.sahishnu.dev](https://forum.sahishnu.dev)

## Features

- User authentication (Login/Signup/Logout) with persistent sessions
- Create topics
- Create/Edit/Delete posts
- Create/Edit/Delete comments
- Likes/Dislikes for posts and comments
- Sorting (Popular (`Likes - Dislikes`), Most Liked, Newest, Oldest)
- Search for posts and comments
- Reset password

## Tech Stack

**Frontend:**

- React
- TypeScript
- Material-UI (MUI)
- React Router
- Vite

**Backend:**

- Go
- Gin Web Framework
- PostgreSQL (Supabase)
- JWT Authentication
- bcrypt password hashing

## Local Setup

1. Clone the repository

```bash
git clone https://github.com/sahishnuk2/web-forum.git
cd web-forum
```

2. Setup Backend

```bash
cd backend
go mod download

# Create .env file with:
# SUPABASE_URL=your-supabase-url
# SUPABASE_KEY=your-supabase-key
# JWT_SECRET=your-secret-key
# ENVIRONMENT=development

go run cmd/main.go
```

3. Setup Frontend

```bash
cd frontend
npm install

# Create .env file with:
# VITE_API_URL=http://localhost:8080

npm run dev
```

4. Access the application at `http://localhost:5173`

## AI Usage

This project was developed with assistance from Claude Code (Anthropic's CLI tool). Claude helped with:

- Code review and best practice suggestions
- Learning and understanding concepts (JWT authentication, CORS, bcrypt hashing)
