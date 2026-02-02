package handlers

import "github.com/gin-gonic/gin"

// Handler holds dependencies for HTTP handlers
type Handler struct {
	// TODO: Add services as dependencies
	// CoinService *services.CoinGeckoService
	// Hub         *websocket.Hub
}

// NewHandler creates a new Handler instance
func NewHandler() *Handler {
	return &Handler{}
}

// GetCoins handles GET /api/coins
func (h *Handler) GetCoins(c *gin.Context) {
	// TODO: Implement - fetch coins from CoinGecko
}

// GetWatchlist handles GET /api/watchlist
func (h *Handler) GetWatchlist(c *gin.Context) {
	// TODO: Implement - return user's watchlist
}

// AddToWatchlist handles POST /api/watchlist
func (h *Handler) AddToWatchlist(c *gin.Context) {
	// TODO: Implement - add coin to watchlist
}

// RemoveFromWatchlist handles DELETE /api/watchlist/:id
func (h *Handler) RemoveFromWatchlist(c *gin.Context) {
	// TODO: Implement - remove coin from watchlist
}

// GetAlerts handles GET /api/alerts
func (h *Handler) GetAlerts(c *gin.Context) {
	// TODO: Implement - return user's price alerts
}

// CreateAlert handles POST /api/alerts
func (h *Handler) CreateAlert(c *gin.Context) {
	// TODO: Implement - create new price alert
}

// DeleteAlert handles DELETE /api/alerts/:id
func (h *Handler) DeleteAlert(c *gin.Context) {
	// TODO: Implement - delete price alert
}

// HandleWebSocket handles WebSocket connections at /ws
func (h *Handler) HandleWebSocket(c *gin.Context) {
	// TODO: Implement WebSocket upgrade and connection handling
}
