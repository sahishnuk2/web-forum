package router

import (
	"web-forum/internal/database"
	"web-forum/internal/handlers"
	"web-forum/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	// Create a new gin router
	router := gin.Default()

	router.Use(cors.Default())

	// Get database to connect
	db := database.GetDB()

	// Define routes
	router.GET("/", func(c *gin.Context) {
    	c.JSON(200, gin.H{"message": "Welcome to Web Forum API"})
  	})

	// For Render
	router.GET("/healthz", func(c *gin.Context) {
  		c.JSON(200, gin.H{"status": "ok"})
	})

	
	// Users
	router.POST("/api/users/signup", handlers.SignUp(db))
	router.POST("/api/users/login", handlers.Login(db))
	router.GET("/api/users/validate", middleware.RequireAuthentication, handlers.Validate)

	// Topics
	router.GET("/api/topics", handlers.GetTopics(db))
	router.POST("/api/topics", handlers.CreateTopic(db))

	// Posts
	router.GET("/api/posts", handlers.GetPosts(db))
	router.GET("/api/posts/:id", handlers.GetPost(db))
	router.POST("/api/posts", handlers.CreatePost(db))
	router.PUT("/api/posts/:id", handlers.UpdatePost(db))
	router.DELETE("/api/posts/:id", handlers.DeletePost(db))

	// Comments
	router.GET("/api/comments", handlers.GetComments(db))
	router.GET("/api/comments/:id", handlers.GetComment(db))
	router.POST("/api/comments", handlers.CreateComment(db))
	router.PUT("/api/comments/:id", handlers.UpdateComments(db))
	router.DELETE("/api/comments/:id", handlers.DeleteComments(db))

	return router
}