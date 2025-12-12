package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type User struct {
	ID int				`json:"id"`
	Username string		`json:"username" binding:"required,min=3,max=50"`
	Password string		`json:"password" binding:"required,min=8"`
	CreatedAt time.Time	`json: created_at`
}

func SignUp(db * sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user User
		
		// Check if username and password are valid
		if err := c.BindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. Username and password required"})
            return
        }

		c.BindJSON(&user)

		_, err := db.Exec(`INSERT INTO users (username, password) VALUES ($1, $2)`, user.Username, user.Password)

          if err != nil {
              // Type assert to PostgreSQL error
              if pqErr, ok := err.(*pq.Error); ok {
                  // 23505 = unique_violation error code
                  if pqErr.Code == "23505" {
                      c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
                      return
                  }
              }
              // Other database errors
              c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
              return
          }

          c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
	}
}

func Login() {

}

