# Web Forum

**Name:** Sahishnu Kumaar

**Deployed Website:** [forum.sahishnu.dev](https://forum.sahishnu.dev)

## Features

- Create topics
- Create/Edit/Delete posts
- Create/Edit/Delete comments
- User authentication (Login/Signup/Logout)

## Tech Stack

**Frontend:**

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Vite

**Backend:**

- Go 1.21+
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
# JWT_SECRET=your-secret-key
# DATABASE_URL=your-supabase-connection-string
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

## Future Enhancements

- Likes feature for posts and comments
- Search functionality for topics/posts
- Sort logic (by date, popularity, etc.)
- User profile page
