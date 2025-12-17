package main

import (
	"log"
	"os"
	"web-forum/internal/database"
	"web-forum/internal/router"
)

func main() {
	database.InitDB()
	r := router.SetUpRouter()

	port := os.Getenv("PORT")
    if port == "" {
        port = ":8080"  // Default port
    }
	log.Printf("Server is running on http://localhost%s", port)

	if err := r.Run(port); err != nil {
		log.Fatalf("Error starting server: %s", err)
	}
}