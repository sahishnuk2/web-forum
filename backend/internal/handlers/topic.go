package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
)

type Topic struct {
	ID int				`json:"id"`
	Title string		`json:"title" binding:"required"`
	CreatedBy int		`json:"created_by"`
	CreatedAt time.Time	`json:"created_at"`
}

func GetTopics(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var topics []Topic
		_, err := client.From("topics").Select("id, title, created_by, created_at", "", false).ExecuteTo(&topics)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve topics"})
            return
		}

		c.JSON(http.StatusOK, topics)
	}
}

func CreateTopic(client *supabase.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var topic Topic

		if err := c.BindJSON(&topic); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		data := map[string]interface{} {
			"title": topic.Title,
			"created_by": userID,
		}

		_, _, err := client.From("topics").Insert(data, false, "", "", "").Execute()
		if err != nil {
            if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
				c.JSON(http.StatusConflict, gin.H{"error": "Topic already exists"})
                return
			}
            
			// Other database errors
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic"})
            return
        }

		c.JSON(http.StatusCreated, gin.H{"message": "Topic created successfully"})
	}
}