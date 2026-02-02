package services

// CoinGecko API service
// Base URL: https://api.coingecko.com/api/v3

// TODO: Implement the following methods:
//
// GetCoins() - Fetch list of coins with prices
// Example: GET /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50
//
// GetCoinPrice(id string) - Fetch single coin price
// Example: GET /simple/price?ids=bitcoin&vs_currencies=usd

type CoinGeckoService struct {
	BaseURL string
}

func NewCoinGeckoService() *CoinGeckoService {
	return &CoinGeckoService{
		BaseURL: "https://api.coingecko.com/api/v3",
	}
}
