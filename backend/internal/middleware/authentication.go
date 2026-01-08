package middleware

import (
	"net/http"
	"os"
	"strconv"
	"time"
	"web-forum/internal/database"
	"web-forum/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuthentication(c *gin.Context) {
	// Get the cookie off request
	tokenString, err := c.Cookie("Authorisation")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Decode / Validate it

	// Parse takes the token string and a function for looking up the key. The latter is especially
	// useful if you use multiple keys for your application.  The standard is to use 'kid' in the
	// head of the token to identify which key to use, but the parsed token (head and claims) is provided
	// to the callback, providing flexibility.
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Check the expiry
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		sub, ok := claims["subject"].(float64)
		if !ok {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		userID := int(sub)

		// Find the user with the token subject
		var user handlers.User
		_, err := database.GetClient().From("users").Select("id, username, password, created_at", "", false).Eq("id", strconv.Itoa(userID)).Single().ExecuteTo(&user)
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if user.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Attach to request
		c.Set("user", user)

		// Continue
		c.Next()

	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
