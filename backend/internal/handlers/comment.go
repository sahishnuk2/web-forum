package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Comment struct {
	ID int				`json:"id"`
	PostID int			`json:"post_id"`
	Content string		`json:"content" binding:"required"`
	CreatedBy int		`json:"created_by"`
	CreatedAt time.Time	`json:"created_at"`
	UpdatedAt time.Time	`json:"updated_at"`
	Username string		`json:"username"`
}

func GetComments(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Query("post_id")
		if postID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post_id is required"})
            return
		}

		query := `
		SELECT 
			comments.id, 
			comments.post_id,
			comments.content, 
			comments.created_by, 
			comments.created_at, 
			comments.updated_at,
			users.username 
		FROM comments 
		INNER JOIN users ON comments.created_by = users.id
		WHERE comments.post_id = $1
		`

		rows, err := db.Query(query, postID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comments"})
            return
		}
		defer rows.Close()

		comments := make([]Comment, 0)
		for rows.Next() {
			var comment Comment
			if err := rows.Scan(&comment.ID, &comment.PostID, &comment.Content, &comment.CreatedBy, &comment.CreatedAt, &comment.UpdatedAt, &comment.Username); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while scanning comments"})
				return
			}
			comments = append(comments, comment)
		}

		c.JSON(http.StatusOK, comments)
	}
}

func GetComment(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		commentID := c.Param("id")

		if commentID == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "comment_id is required"})
            return
		}
		var comment Comment

		query := `
		SELECT 
			comments.id, 
			comments.post_id,
			comments.content, 
			comments.created_by, 
			comments.created_at, 
			comments.updated_at,
			users.username 
		FROM comments 
		INNER JOIN users ON comments.created_by = users.id
		WHERE comments.id = $1
		`

		err := db.QueryRow(query, commentID).Scan(&comment.ID, &comment.PostID, &comment.Content, &comment.CreatedBy, &comment.CreatedAt, &comment.UpdatedAt, &comment.Username)
		if err == sql.ErrNoRows {
      		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
      		return
  		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comment"})
            return
		}
		c.JSON(http.StatusOK, comment)
	}
}

func CreateComment(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var comment Comment

		if err := c.BindJSON(&comment); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input."})
            return
		}

		_, err := db.Exec(`INSERT INTO comments (post_id, content, created_by) VALUES ($1, $2, $3)`, comment.PostID, comment.Content, comment.CreatedBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully"})
	}
}

func UpdateComments(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var input struct {
			UserID int 		`json:"user_id"`
			Content string 	`json:"content" binding:"required"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		var createdBy int
		err := db.QueryRow(`SELECT created_by FROM comments WHERE id = $1`, id).Scan(&createdBy)
		
		if err == sql.ErrNoRows {
      		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
      		return
  		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comment"})
            return
		}

		if createdBy != input.UserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit comments created by you"})
            return
		}

		_, err = db.Exec(`UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2`, input.Content, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit comment"})
            return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Comment edited successfully"})
	}
}

func DeleteComments(db *sql.DB) gin.HandlerFunc {
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
		err := db.QueryRow(`SELECT created_by FROM comments WHERE id = $1`, id).Scan(&createdBy)
		
		if err == sql.ErrNoRows {
      		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
      		return
  		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comment"})
            return
		}

		if createdBy != input.UserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete comments created by you"})
            return
		}

		_, err = db.Exec(`DELETE FROM comments WHERE id = $1`, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
            return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
	}
}
