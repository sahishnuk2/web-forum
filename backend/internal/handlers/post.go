package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Post struct {
	ID int				`json:"id"`
	TopicID int			`json:"topic_id"`
	Title string		`json:"title" binding:"required"`
	Content string		`json:"content" binding:"required"`
	CreatedBy int		`json:"created_by"`
	CreatedAt time.Time	`json:"created_at"`
}

func GetPosts(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		topicID := c.Query("topic_id")

		if topicID == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "topic_id is required"})
            return
		}

		rows, err := db.Query(`SELECT id, topic_id, title, content, created_by, created_at FROM posts WHERE topic_id = $1`, topicID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve posts"})
            return
		}
		defer rows.Close()

		var posts []Post
		for rows.Next() {
			var post Post
			if err := rows.Scan(&post.ID, &post.TopicID, &post.Title, &post.Content, &post.CreatedBy, &post.CreatedAt); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while scanning posts"})
				return
			}
			posts = append(posts, post)
		}

		c.JSON(http.StatusOK, posts)
	}
}

func CreatePost(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var post Post
		if err := c.BindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Input"})
			return
		}

		_, err := db.Exec(`INSERT INTO posts (topic_id, title, content, created_by) VALUES ($1, $2, $3, $4)`, post.TopicID, post.Title, post.Content, post.CreatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create posts"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Post created successfully"})
	}
}

func UpdatePost(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var input struct {
			Title string	`json:"title" binding:"required"`
			Content string	`json:"content" binding:"required"`
			UserID int 		`json:"user_id"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		var createdBy int
		err := db.QueryRow(`SELECT created_by FROM posts WHERE id = $1`, id).Scan(&createdBy)

		if err == sql.ErrNoRows {
      		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
      		return
  		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
            return
		}

		if createdBy != input.UserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit posts created by you"})
            return
		}

		_, err = db.Exec(`UPDATE posts SET title = $1, content = $2 WHERE id = $3`, input.Title, input.Content, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit post"})
            return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Post edited successfully"})
	}
}

func DeletePost(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var input struct {
			UserID int `json:"user_id"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		var createdBy int
		err := db.QueryRow(`SELECT created_by FROM posts WHERE id = $1`, id).Scan(&createdBy)

		if err == sql.ErrNoRows {
      		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
      		return
  		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
            return
		}

		if createdBy != input.UserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete posts created by you"})
            return
		}

		_, err = db.Exec(`DELETE FROM posts WHERE id = $1`, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
            return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
	}
}