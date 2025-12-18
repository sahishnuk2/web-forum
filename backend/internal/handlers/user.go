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
	CreatedAt time.Time	`json:"created_at"`
}

func SignUp(db * sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user User
		
		// Check if username and password are valid
		if err := c.BindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. Username and password invalid"})
            return
        }

		_, err := db.Exec(`INSERT INTO users (username, password) VALUES ($1, $2)`, user.Username, user.Password)

        if err != nil {
            // Check what type of error -> does it violate uniqueness
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

func Login(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input User
		
		// Validate input
		if err := c.BindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
		}

		var user User
		err := db.QueryRow(`SELECT id, username, password, created_at FROM users WHERE username = $1`, input.Username).Scan(&user.ID, &user.Username, &user.Password, &user.CreatedAt)

		// Check if username is there
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username"})
            return
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
            return
		}

		// Check if password is correct
		if user.Password != input.Password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
            return
		}
		
		// Success, send user data to frontend
		c.JSON(http.StatusOK, gin.H {
			"message": "Login successful",
            "user": gin.H{
                "id": user.ID,
                "username": user.Username,
            },
		})
	}
}

