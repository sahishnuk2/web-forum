package database

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func InitDB() {
	connect()
	initUserTable()
	initTopicTable()
	initPostTable()
	initCommentsTable()
}

func GetDB() *sql.DB {
	return db
}

func connect() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables instead")
	}

	// Get the connection string
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL is not set in .env or environment")
	}

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database: ", err)
	}

	// Check connection once
	if err := db.Ping(); err != nil {
		log.Fatal("Could not connect to database:", err)
	}
}

func initUserTable() {
	createTableQuery := `CREATE TABLE IF NOT EXISTS users (
		id          SERIAL PRIMARY KEY,
		username    VARCHAR(50) UNIQUE NOT NULL,
		password    TEXT NOT NULL,
		created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`

	execute(createTableQuery)
}

func initTopicTable() {
	createTableQuery := `CREATE TABLE IF NOT EXISTS topics (
		id          SERIAL PRIMARY KEY,
		title       VARCHAR(255) UNIQUE NOT NULL,
		created_by  INT REFERENCES users(id) ON DELETE SET NULL,
		created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`

	execute(createTableQuery)
}

func initPostTable() {
	createTableQuery := `CREATE TABLE IF NOT EXISTS posts (
		id          SERIAL PRIMARY KEY,
		topic_id    INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
		title       VARCHAR(255) NOT NULL,
		content     TEXT NOT NULL,
		created_by  INT REFERENCES users(id) ON DELETE SET NULL,
		created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`

	execute(createTableQuery)
}

func initCommentsTable() {
	createTableQuery := `CREATE TABLE IF NOT EXISTS comments (
		id          SERIAL PRIMARY KEY,
		post_id     INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
		content     TEXT NOT NULL,
		created_by  INT REFERENCES users(id) ON DELETE SET NULL,
		created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`

	execute(createTableQuery)
}

func execute(query string) {
	_, err := db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
}
