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
	UpdatedAt time.Time	`json:"updated_at"`
	Username string 	`json:"username"`
}

func GetPosts(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		topicID := c.Query("topic_id")

		if topicID == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "topic_id is required"})
            return
		}

		query := `
		SELECT 
			posts.id, 
			posts.topic_id, 
			posts.title, 
			posts.content, 
			posts.created_by, 
			posts.created_at, 
			posts.updated_at,
			users.username 
		FROM posts 
		INNER JOIN users ON posts.created_by = users.id
		WHERE posts.topic_id = $1`

		rows, err := db.Query(query, topicID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve posts"})
            return
		}
		defer rows.Close()

		posts := make([]Post, 0)
		for rows.Next() {
			var post Post
			if err := rows.Scan(&post.ID, &post.TopicID, &post.Title, &post.Content, &post.CreatedBy, &post.CreatedAt, &post.UpdatedAt, &post.Username); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while scanning posts"})
				return
			}
			posts = append(posts, post)
		}

		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error during retrieval"})
			return
		}

		c.JSON(http.StatusOK, posts)
	}
}

func GetPost(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Param("id")

		if postID == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "post_id is required"})
            return
		}
		var post Post
		query := `
		SELECT 
			posts.id, 
			posts.topic_id, 
			posts.title, 
			posts.content, 
			posts.created_by, 
			posts.created_at, 
			posts.updated_at,
			users.username 
		FROM posts 
		INNER JOIN users ON posts.created_by = users.id
		WHERE posts.id = $1`

		err := db.QueryRow(query, postID).Scan(&post.ID, &post.TopicID, &post.Title, &post.Content, &post.CreatedBy, &post.CreatedAt, &post.UpdatedAt, &post.Username)

		if err == sql.ErrNoRows {
      		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
      		return
  		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
            return
		}
		c.JSON(http.StatusOK, post)
	}
}

func CreatePost(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var post Post
		if err := c.BindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Input"})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		_, err := db.Exec(`INSERT INTO posts (topic_id, title, content, created_by) VALUES ($1, $2, $3, $4)`, post.TopicID, post.Title, post.Content, userID)
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
			Title string		`json:"title" binding:"required"`
			Content string		`json:"content" binding:"required"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

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

		if createdBy != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit posts created by you"})
            return
		}

		_, err = db.Exec(`UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3`, input.Title, input.Content, id)
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

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

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

		if createdBy != userID {
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
