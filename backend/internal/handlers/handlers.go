package handlers

import (
	"net/http"
	"sync"

	"crypto-live/internal/models"
	"crypto-live/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Handler holds dependencies for HTTP handlers
type Handler struct {
	CoinService *services.CoinGeckoService
	watchlist   map[string]models.WatchlistItem
	alerts      map[string]models.PriceAlert
	mu          sync.RWMutex
}

// NewHandler creates a new Handler instance
func NewHandler(coinService *services.CoinGeckoService) *Handler {
	return &Handler{
		CoinService: coinService,
		watchlist:   make(map[string]models.WatchlistItem),
		alerts:      make(map[string]models.PriceAlert),
	}
}

// GetCoins handles GET /api/coins
func (h *Handler) GetCoins(c *gin.Context) {
	coins := h.CoinService.GetCachedCoins()
	c.JSON(http.StatusOK, coins)
}

// GetWatchlist handles GET /api/watchlist
func (h *Handler) GetWatchlist(c *gin.Context) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	items := make([]models.WatchlistItem, 0, len(h.watchlist))
	for _, item := range h.watchlist {
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

// AddToWatchlist handles POST /api/watchlist
func (h *Handler) AddToWatchlist(c *gin.Context) {
	var req struct {
		CoinID string `json:"coin_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	// Check if already in watchlist
	for _, item := range h.watchlist {
		if item.CoinID == req.CoinID {
			c.JSON(http.StatusConflict, gin.H{"error": "coin already in watchlist"})
			return
		}
	}

	item := models.WatchlistItem{
		ID:     uuid.New().String(),
		CoinID: req.CoinID,
	}
	h.watchlist[item.ID] = item

	c.JSON(http.StatusCreated, item)
}

// RemoveFromWatchlist handles DELETE /api/watchlist/:id
func (h *Handler) RemoveFromWatchlist(c *gin.Context) {
	id := c.Param("id")

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.watchlist[id]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}

	delete(h.watchlist, id)
	c.JSON(http.StatusOK, gin.H{"message": "removed from watchlist"})
}

// GetAlerts handles GET /api/alerts
func (h *Handler) GetAlerts(c *gin.Context) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	alerts := make([]models.PriceAlert, 0, len(h.alerts))
	for _, alert := range h.alerts {
		alerts = append(alerts, alert)
	}
	c.JSON(http.StatusOK, alerts)
}

// CreateAlert handles POST /api/alerts
func (h *Handler) CreateAlert(c *gin.Context) {
	var req struct {
		CoinID      string  `json:"coin_id" binding:"required"`
		TargetPrice float64 `json:"target_price" binding:"required"`
		Condition   string  `json:"condition" binding:"required,oneof=above below"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	alert := models.PriceAlert{
		ID:          uuid.New().String(),
		CoinID:      req.CoinID,
		TargetPrice: req.TargetPrice,
		Condition:   req.Condition,
		IsTriggered: false,
	}
	h.alerts[alert.ID] = alert

	c.JSON(http.StatusCreated, alert)
}

// DeleteAlert handles DELETE /api/alerts/:id
func (h *Handler) DeleteAlert(c *gin.Context) {
	id := c.Param("id")

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.alerts[id]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "alert not found"})
		return
	}

	delete(h.alerts, id)
	c.JSON(http.StatusOK, gin.H{"message": "alert deleted"})
}

// CheckAlerts checks if any alerts should be triggered based on current prices
func (h *Handler) CheckAlerts(coins []models.Coin) []models.PriceAlert {
	h.mu.Lock()
	defer h.mu.Unlock()

	var triggered []models.PriceAlert

	priceMap := make(map[string]float64)
	for _, coin := range coins {
		priceMap[coin.ID] = coin.CurrentPrice
	}

	for id, alert := range h.alerts {
		if alert.IsTriggered {
			continue
		}

		price, exists := priceMap[alert.CoinID]
		if !exists {
			continue
		}

		shouldTrigger := false
		if alert.Condition == "above" && price >= alert.TargetPrice {
			shouldTrigger = true
		} else if alert.Condition == "below" && price <= alert.TargetPrice {
			shouldTrigger = true
		}

		if shouldTrigger {
			alert.IsTriggered = true
			h.alerts[id] = alert
			triggered = append(triggered, alert)
		}
	}

	return triggered
}
