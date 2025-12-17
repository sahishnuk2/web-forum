package router

import (
	"web-forum/internal/database"
	"web-forum/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	// Create a new gin router
	router := gin.Default()

	// Get database to connect
	db := database.GetDB()

	// Define routes
	// Users
	router.POST("/api/users/signup", handlers.SignUp(db))
	router.POST("/api/users/login", handlers.Login(db))

	// Topics
	router.GET("/api/topics", handlers.GetTopics(db))
	router.POST("/api/topics", handlers.CreateTopic(db))

	// Posts
	router.GET("/api/posts", handlers.GetPosts(db))
	router.POST("/api/posts", handlers.CreatePost(db))
	router.PUT("/api/posts/:id", handlers.UpdatePost(db))
	router.DELETE("/api/posts/:id", handlers.DeletePost(db))

	// Comments
	router.GET("/api/comments", handlers.GetComments(db))
	router.POST("/api/comments", handlers.CreateComment(db))
	router.PUT("/api/comments/:id", handlers.UpdateComments(db))
	router.DELETE("/api/comments/:id", handlers.DeleteComments(db))

	return router
}