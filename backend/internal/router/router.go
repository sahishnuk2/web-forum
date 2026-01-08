package router

import (
	"time"
	"web-forum/internal/database"
	"web-forum/internal/handlers"
	"web-forum/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	// Create a new gin router
	router := gin.Default()

	// This is to send cookies from frontend to backend and vice versa
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://forum.sahishnu.dev"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Get database to connect
	client := database.GetClient()

	// Define routes
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Welcome to Web Forum API"})
	})

	// For Render
	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Users
	router.POST("/api/users/signup", handlers.SignUp(client))
	router.POST("/api/users/login", handlers.Login(client))
	router.GET("/api/users/validate", middleware.RequireAuthentication, handlers.Validate)
	router.POST("/api/users/logout", handlers.LogOut)

	// Topics
	router.GET("/api/topics", middleware.RequireAuthentication, handlers.GetTopics(client))
	router.POST("/api/topics", middleware.RequireAuthentication, handlers.CreateTopic(client))

	// Posts
	router.GET("/api/posts", middleware.RequireAuthentication, handlers.GetPosts(client))
	router.GET("/api/posts/:id", middleware.RequireAuthentication, handlers.GetPost(client))
	router.POST("/api/posts", middleware.RequireAuthentication, handlers.CreatePost(client))
	router.PUT("/api/posts/:id", middleware.RequireAuthentication, handlers.UpdatePost(client))
	router.DELETE("/api/posts/:id", middleware.RequireAuthentication, handlers.DeletePost(client))

	// Comments
	router.GET("/api/comments", middleware.RequireAuthentication, handlers.GetComments(client))
	router.GET("/api/comments/:id", middleware.RequireAuthentication, handlers.GetComment(client))
	router.POST("/api/comments", middleware.RequireAuthentication, handlers.CreateComment(client))
	router.PUT("/api/comments/:id", middleware.RequireAuthentication, handlers.UpdateComment(client))
	router.DELETE("/api/comments/:id", middleware.RequireAuthentication, handlers.DeleteComment(client))

	return router
}
