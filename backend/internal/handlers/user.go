package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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

		hashedPassword, err := hashPassword(user.Password)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
            return
		}

		_, err = db.Exec(`INSERT INTO users (username, password) VALUES ($1, $2)`, user.Username, hashedPassword)

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
		if !comparePasswordAndHash(input.Password, user.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
            return
		}

		// Create a new token object, specifying signing method and the claims
		// you would like it to contain.
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"subject": user.ID,
			"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
		})

		// Sign and get the complete encoded token as a string using the secret
		tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication error"})
            return
		}

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("Authorisation", tokenString, 3600 * 24 * 30, "/", "", false, true)
		
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

func Validate(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(User)

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
            	"id": currentUser.ID,
                "username": currentUser.Username,
		},
	})
}

func LogOut(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorisation", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}

func hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(hash), err;
}

func comparePasswordAndHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

