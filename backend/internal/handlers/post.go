package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
)

type Post struct {
	ID        int       `json:"id"`
	TopicID   int       `json:"topic_id"`
	Title     string    `json:"title" binding:"required"`
	Content   string    `json:"content" binding:"required"`
	CreatedBy int       `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Users     struct {
		Username string `json:"username"`
	} `json:"users"`
}

func GetPosts(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		topicID := c.Query("topic_id")
		var posts []Post

		if topicID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "topic_id is required"})
			return
		}

		_, err := client.From("posts").Select(`id, topic_id, title, content, created_by, created_at, updated_at, users(username)`, "", false).Eq("topic_id", topicID).ExecuteTo(&posts)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve posts"})
			return
		}

		c.JSON(http.StatusOK, posts)
	}
}

func GetPost(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Param("id")

		if postID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post_id is required"})
			return
		}
		var post Post
		_, err := client.From("posts").Select(`id, topic_id, title, content, created_by, created_at, updated_at, users(username)`, "", false).Eq("id", postID).Single().ExecuteTo(&post)

		if err != nil {
			if strings.Contains(err.Error(), "PGRST116") || strings.Contains(err.Error(), "0 rows") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
			return
		}

		c.JSON(http.StatusOK, post)
	}
}

func CreatePost(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var post Post
		if err := c.BindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Input"})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		data := map[string]interface{}{
			"topic_id":   post.TopicID,
			"title":      post.Title,
			"content":    post.Content,
			"created_by": userID,
		}

		_, _, err := client.From("posts").Insert(data, false, "", "", "").Execute()

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Post created successfully"})
	}
}

func UpdatePost(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var input struct {
			Title   string `json:"title" binding:"required"`
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
		_, err := client.From("posts").Select("created_by", "", false).Eq("id", id).Single().ExecuteTo(&result)

		if err != nil {
			if strings.Contains(err.Error(), "PGRST116") || strings.Contains(err.Error(), "0 rows") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
			return
		}

		if result.CreatedBy != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only edit posts created by you"})
			return
		}

		data := map[string]interface{}{
			"title":      input.Title,
			"content":    input.Content,
			"updated_at": time.Now(),
		}

		_, _, err = client.From("posts").Update(data, "", "").Eq("id", id).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit post"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Post edited successfully"})
	}
}

func DeletePost(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		var result struct {
			CreatedBy int `json:"created_by"`
		}

		_, err := client.From("posts").Select("created_by", "", false).Eq("id", id).Single().ExecuteTo(&result)

		if err != nil {
			if strings.Contains(err.Error(), "PGRST116") || strings.Contains(err.Error(), "0 rows") {
				c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve post"})
			return
		}

		if result.CreatedBy != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete posts created by you"})
			return
		}

		_, _, err = client.From("posts").Delete("", "").Eq("id", id).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
	}
}
