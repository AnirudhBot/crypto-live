package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"crypto-live/internal/handlers"
	"crypto-live/internal/models"
	"crypto-live/internal/services"
	"crypto-live/internal/websocket"

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

	// Initialize services
	coinService := services.NewCoinGeckoService()
	hub := websocket.NewHub()
	handler := handlers.NewHandler(coinService)

	// Start WebSocket hub
	go hub.Run()

	// Start polling CoinGecko API and broadcast updates
	coinService.StartPolling(30*time.Second, func(coins []models.Coin) {
		log.Printf("Fetched %d coins, broadcasting to clients", len(coins))

		// Check for triggered alerts
		triggered := handler.CheckAlerts(coins)
		if len(triggered) > 0 {
			log.Printf("Triggered %d alerts", len(triggered))
		}

		// Broadcast price update to all WebSocket clients
		message := struct {
			Type   string              `json:"type"`
			Data   []models.Coin       `json:"data"`
			Alerts []models.PriceAlert `json:"alerts,omitempty"`
		}{
			Type:   "price_update",
			Data:   coins,
			Alerts: triggered,
		}

		jsonData, err := json.Marshal(message)
		if err != nil {
			log.Printf("Error marshaling price update: %v", err)
			return
		}
		hub.Broadcast(jsonData)
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		api.GET("/coins", handler.GetCoins)
		api.GET("/watchlist", handler.GetWatchlist)
		api.POST("/watchlist", handler.AddToWatchlist)
		api.DELETE("/watchlist/:id", handler.RemoveFromWatchlist)
		api.GET("/alerts", handler.GetAlerts)
		api.POST("/alerts", handler.CreateAlert)
		api.DELETE("/alerts/:id", handler.DeleteAlert)
	}

	// WebSocket endpoint
	r.GET("/ws", hub.HandleWebSocket)

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
