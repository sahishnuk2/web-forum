package handlers

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
)

type Post struct {
	ID        int    `json:"id"`
	TopicID   int    `json:"topic_id"`
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content" binding:"required"`
	CreatedBy int    `json:"created_by"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Users     struct {
		Username string `json:"username"`
	} `json:"users"`
}

type FlatPost struct {
	ID           int    `json:"id"`
	TopicID      int    `json:"topic_id"`
	Title        string `json:"title" binding:"required"`
	Content      string `json:"content" binding:"required"`
	CreatedBy    int    `json:"created_by"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
	Username     string `json:"username"`
	LikeCount    int    `json:"like_count"`
	DislikeCount int    `json:"dislike_count"`
	UserReaction *int   `json:"user_reaction"`
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
			log.Printf("Error fetching posts: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve posts"})
			return
		}

		postIDs := make([]string, 0, len(posts))
		for _, post := range posts {
			postIDs = append(postIDs, strconv.Itoa(post.ID))
		}

		type PostReactionRow struct {
			PostID   int `json:"post_id"`
			UserID   int `json:"user_id"`
			Reaction int `json:"reaction"`
		}

		var reactions []PostReactionRow

		if len(postIDs) > 0 {
			_, err = client.From("post_reactions").Select("post_id, user_id, reaction", "", false).In("post_id", postIDs).ExecuteTo(&reactions)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reactions"})
				return
			}
		}

		flatPosts := make([]FlatPost, len(posts))
		for i, post := range posts {
			flatPosts[i] = FlatPost{
				ID:           post.ID,
				TopicID:      post.TopicID,
				Title:        post.Title,
				Content:      post.Content,
				CreatedBy:    post.CreatedBy,
				CreatedAt:    post.CreatedAt,
				UpdatedAt:    post.UpdatedAt,
				Username:     post.Users.Username,
				LikeCount:    0,
				DislikeCount: 0,
				UserReaction: nil,
			}
		}

		postMap := make(map[int]*FlatPost)
		// Faster to search for specific post
		for i := range flatPosts {
			postMap[flatPosts[i].ID] = &flatPosts[i]
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		for _, reaction := range reactions {
			post := postMap[reaction.PostID]
			if post == nil {
				continue
			}

			if reaction.Reaction == 1 {
				post.LikeCount++
			} else if reaction.Reaction == -1 {
				post.DislikeCount++
			}

			if reaction.UserID == userID {
				r := reaction.Reaction
				post.UserReaction = &r
			}
		}

		c.JSON(http.StatusOK, flatPosts)
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

		type PostReactionRow struct {
			PostID   int `json:"post_id"`
			UserID   int `json:"user_id"`
			Reaction int `json:"reaction"`
		}

		var reactions []PostReactionRow

		_, err = client.From("post_reactions").Select("post_id, user_id, reaction", "", false).Eq("post_id", postID).ExecuteTo(&reactions)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reactions"})
			return
		}

		flatPost := FlatPost{
			ID:           post.ID,
			TopicID:      post.TopicID,
			Title:        post.Title,
			Content:      post.Content,
			CreatedBy:    post.CreatedBy,
			CreatedAt:    post.CreatedAt,
			UpdatedAt:    post.UpdatedAt,
			Username:     post.Users.Username,
			LikeCount:    0,
			DislikeCount: 0,
			UserReaction: nil,
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		for _, reaction := range reactions {
			if reaction.Reaction == 1 {
				flatPost.LikeCount++
			} else if reaction.Reaction == -1 {
				flatPost.DislikeCount++
			}

			if reaction.UserID == userID {
				r := reaction.Reaction
				flatPost.UserReaction = &r
			}
		}

		c.JSON(http.StatusOK, flatPost)
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
