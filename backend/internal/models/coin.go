package models

// Coin represents a cryptocurrency
type Coin struct {
	ID           string  `json:"id"`
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	CurrentPrice float64 `json:"current_price"`
	PriceChange  float64 `json:"price_change_24h"`
	ChangePercent float64 `json:"price_change_percentage_24h"`
}

// WatchlistItem represents a coin in the user's watchlist
type WatchlistItem struct {
	ID     string `json:"id"`
	CoinID string `json:"coin_id"`
}

// PriceAlert represents a price alert configuration
type PriceAlert struct {
	ID          string  `json:"id"`
	CoinID      string  `json:"coin_id"`
	TargetPrice float64 `json:"target_price"`
	Condition   string  `json:"condition"` // "above" or "below"
	IsTriggered bool    `json:"is_triggered"`
}

// PriceUpdate represents a real-time price update sent via WebSocket
type PriceUpdate struct {
	CoinID string  `json:"coin_id"`
	Price  float64 `json:"price"`
}
