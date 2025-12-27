package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type Topic struct {
	ID int				`json:"id"`
	Title string		`json:"title" binding:"required"`
	CreatedBy int		`json:"created_by"`
	CreatedAt time.Time	`json:"created_at"`
}

func GetTopics(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT id, title, created_by, created_at FROM topics")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve topics"})
            return
		}
		defer rows.Close()

		topics := make([]Topic, 0)
		for rows.Next() {
			var topic Topic
			if err := rows.Scan(&topic.ID, &topic.Title, &topic.CreatedBy, &topic.CreatedAt); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while scanning topics"})
				return
			}
			topics = append(topics, topic)
		}
		
		// To check if all data is received
		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error during retrieval"})
			return
		}

		c.JSON(http.StatusOK, topics)
	}
}

func CreateTopic(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var topic Topic

		if err := c.BindJSON(&topic); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
		}

		user, _ := c.Get("user")
		currentUser := user.(User)
		userID := currentUser.ID

		_, err := db.Exec(`INSERT INTO topics (title, created_by) VALUES ($1, $2)`, topic.Title, userID)

		if err != nil {
            // Check what type of error -> does it violate uniqueness
            if pqErr, ok := err.(*pq.Error); ok {
                // 23505 = unique_violation error code
                if pqErr.Code == "23505" {
                    c.JSON(http.StatusConflict, gin.H{"error": "Topic already exists"})
                    return
                }
            }
            
			// Other database errors
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic"})
            return
        }

		c.JSON(http.StatusCreated, gin.H{"message": "Topic created successfully"})
	}
}