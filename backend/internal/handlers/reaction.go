package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
)

type PostReaction struct {
	Reaction int `json:"reaction"`
}

type CommentReaction struct {
	Reaction int `json:"reaction"`
}

func CreatePostReaction(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		postIDStr := c.Param("id")
		postID, err := strconv.Atoi(postIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post id"})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID
		strUserId := strconv.Itoa(userID)

		var input PostReaction
		if err := c.BindJSON(&input); err != nil || (input.Reaction != 1 && input.Reaction != -1) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reaction"})
			return
		}

		reaction := input.Reaction
		var existing []PostReaction
		_, err = client.From("post_reactions").Select("reaction", "", false).Eq("user_id", strUserId).Eq("post_id", postIDStr).ExecuteTo(&existing)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reaction"})
			return
		}

		if len(existing) == 0 {
			// Insert reaction
			data := map[string]interface{}{
				"post_id":  postID,
				"user_id":  userID,
				"reaction": reaction,
			}
			_, _, err = client.From("post_reactions").Insert(data, false, "", "", "").Execute()

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reaction"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Reaction created"})
			return
		}

		currentReaction := existing[0].Reaction
		if reaction == currentReaction {
			// Means double click
			// Delete
			_, _, err = client.From("post_reactions").Delete("", "").Eq("post_id", postIDStr).Eq("user_id", strUserId).Execute()

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete reaction"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Reaction deleted"})
			return
		}
		// Like -> Dislike or opposite
		// Update
		data := map[string]interface{}{
			"reaction": reaction,
		}
		_, _, err = client.From("post_reactions").Update(data, "", "").Eq("post_id", postIDStr).Eq("user_id", strUserId).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update reaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Reaction updated"})
	}
}

func CreateCommentReaction(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		commentIDStr := c.Param("id")
		commentID, err := strconv.Atoi(commentIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment id"})
			return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID
		strUserId := strconv.Itoa(userID)

		var input CommentReaction
		if err := c.BindJSON(&input); err != nil || (input.Reaction != 1 && input.Reaction != -1) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reaction"})
			return
		}

		reaction := input.Reaction
		var existing []CommentReaction
		_, err = client.From("comment_reactions").Select("reaction", "", false).Eq("user_id", strUserId).Eq("comment_id", commentIDStr).ExecuteTo(&existing)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reaction"})
			return
		}

		if len(existing) == 0 {
			// Insert reaction
			data := map[string]interface{}{
				"comment_id": commentID,
				"user_id":    userID,
				"reaction":   reaction,
			}
			_, _, err = client.From("comment_reactions").Insert(data, false, "", "", "").Execute()

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reaction"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Reaction created"})
			return
		}

		currentReaction := existing[0].Reaction
		if reaction == currentReaction {
			// Means double click
			// Delete
			_, _, err = client.From("comment_reactions").Delete("", "").Eq("comment_id", commentIDStr).Eq("user_id", strUserId).Execute()

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete reaction"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Reaction deleted"})
			return
		}
		// Like -> Dislike or opposite
		// Update
		data := map[string]interface{}{
			"reaction": reaction,
		}
		_, _, err = client.From("comment_reactions").Update(data, "", "").Eq("comment_id", commentIDStr).Eq("user_id", strUserId).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update reaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Reaction updated"})
	}
}
