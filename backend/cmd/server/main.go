package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API routes group
	api := r.Group("/api")
	{
		// TODO: Add your routes here
		api.GET("/coins", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "List coins endpoint"})
		})

		api.GET("/watchlist", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get watchlist endpoint"})
		})

		api.POST("/watchlist", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Add to watchlist endpoint"})
		})

		api.DELETE("/watchlist/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Remove from watchlist endpoint"})
		})

		api.GET("/alerts", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get alerts endpoint"})
		})

		api.POST("/alerts", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Create alert endpoint"})
		})

		api.DELETE("/alerts/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Delete alert endpoint"})
		})
	}

	// WebSocket endpoint for real-time prices
	r.GET("/ws", func(c *gin.Context) {
		// TODO: Implement WebSocket handler
		c.JSON(http.StatusOK, gin.H{"message": "WebSocket endpoint - implement handler"})
	})

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
