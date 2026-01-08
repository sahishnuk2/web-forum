package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
)

type Comment struct {
	ID        int    `json:"id"`
	PostID    int    `json:"post_id"`
	Content   string `json:"content" binding:"required"`
	CreatedBy int    `json:"created_by"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Users     struct {
		Username string `json:"username"`
	} `json:"users"`
}

type FlatComment struct {
	ID        int    `json:"id"`
	PostID    int    `json:"post_id"`
	Content   string `json:"content" binding:"required"`
	CreatedBy int    `json:"created_by"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Username  string `json:"username"`
}

func GetComments(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Query("post_id")
		var comments []Comment

		if postID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post_id is required"})
			return
		}

		_, err := client.From("comments").Select(`id, post_id, content, created_by, created_at, updated_at, users(username)`, "", false).Eq("post_id", postID).ExecuteTo(&comments)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comments"})
			return
		}

		flatComments := make([]FlatComment, len(comments))
		for i, comment := range comments {
			flatComments[i] = FlatComment{
				ID:        comment.ID,
				PostID:    comment.PostID,
				Content:   comment.Content,
				CreatedBy: comment.CreatedBy,
				CreatedAt: comment.CreatedAt,
				UpdatedAt: comment.UpdatedAt,
				Username:  comment.Users.Username,
			}
		}

		c.JSON(http.StatusOK, flatComments)
	}
}

func GetComment(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		commentID := c.Param("id")

		if commentID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "comment_id is required"})
			return
		}
		var comment Comment

		_, err := client.From("comments").Select(`id, post_id, content, created_by, created_at, updated_at, users(username)`, "", false).Eq("id", commentID).Single().ExecuteTo(&comment)

		if err != nil {
			if strings.Contains(err.Error(), "PGRST116") || strings.Contains(err.Error(), "0 rows") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comment"})
			return
		}

		flatComment := FlatComment{
			ID:        comment.ID,
			PostID:    comment.PostID,
			Content:   comment.Content,
			CreatedBy: comment.CreatedBy,
			CreatedAt: comment.CreatedAt,
			UpdatedAt: comment.UpdatedAt,
			Username:  comment.Users.Username,
		}

		c.JSON(http.StatusOK, flatComment)
	}
}

func CreateComment(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var comment Comment

		if err := c.BindJSON(&comment); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input."})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		data := map[string]interface{}{
			"post_id":    comment.PostID,
			"content":    comment.Content,
			"created_by": userID,
		}

		_, _, err := client.From("comments").Insert(data, false, "", "", "").Execute()

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully"})
	}
}

func UpdateComment(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var input struct {
			Content string `json:"content" binding:"required"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		var result struct {
			CreatedBy int `json:"created_by"`
		}
		_, err := client.From("comments").Select("created_by", "", false).Eq("id", id).Single().ExecuteTo(&result)

		if err != nil {
			if strings.Contains(err.Error(), "PGRST116") || strings.Contains(err.Error(), "0 rows") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment"})
			return
		}

		if result.CreatedBy != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit comments created by you"})
			return
		}

		data := map[string]interface{}{
			"content": input.Content,
		}
		_, _, err = client.From("comments").Update(data, "", "").Eq("id", id).Execute()

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit comment"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Comment edited successfully"})
	}
}

func DeleteComment(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		var result struct {
			CreatedBy int `json:"created_by"`
		}
		_, err := client.From("comments").Select("created_by", "", false).Eq("id", id).Single().ExecuteTo(&result)

		if err != nil {
			if strings.Contains(err.Error(), "PGRST116") || strings.Contains(err.Error(), "0 rows") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comment"})
			return
		}

		if result.CreatedBy != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete comments created by you"})
			return
		}

		_, _, err = client.From("comments").Delete("", "").Eq("id", id).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
	}
}
