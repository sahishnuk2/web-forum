package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/supabase-community/supabase-go"
)

var client *supabase.Client

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables instead")
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")
	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL or SUPABASE_URL must be set in .env or environment")
	}

	client, err = supabase.NewClient(supabaseURL, supabaseKey, &supabase.ClientOptions{})
	if err != nil {
		fmt.Println("Failed to initalize the client: ", err)
	}

	log.Println("Successfully initialized Supabase client")
}

func GetClient() *supabase.Client {
	return client
}
