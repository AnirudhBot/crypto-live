package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"crypto-live/internal/models"
)

type CoinGeckoService struct {
	BaseURL    string
	httpClient *http.Client
	cache      []models.Coin
	cacheMu    sync.RWMutex
}

func NewCoinGeckoService() *CoinGeckoService {
	return &CoinGeckoService{
		BaseURL: "https://api.coingecko.com/api/v3",
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// FetchCoins fetches top coins from CoinGecko API
func (s *CoinGeckoService) FetchCoins() ([]models.Coin, error) {
	url := fmt.Sprintf("%s/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1", s.BaseURL)

	resp, err := s.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch coins: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("CoinGecko API returned status: %d", resp.StatusCode)
	}

	var coins []models.Coin
	if err := json.NewDecoder(resp.Body).Decode(&coins); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Update cache
	s.cacheMu.Lock()
	s.cache = coins
	s.cacheMu.Unlock()

	return coins, nil
}

// GetCachedCoins returns the cached coins
func (s *CoinGeckoService) GetCachedCoins() []models.Coin {
	s.cacheMu.RLock()
	defer s.cacheMu.RUnlock()
	return s.cache
}

// StartPolling starts polling CoinGecko API at the specified interval
// and calls the callback function with updated coins
func (s *CoinGeckoService) StartPolling(interval time.Duration, onUpdate func([]models.Coin)) {
	// Fetch immediately on start
	if coins, err := s.FetchCoins(); err == nil {
		onUpdate(coins)
	}

	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			coins, err := s.FetchCoins()
			if err != nil {
				fmt.Printf("Error fetching coins: %v\n", err)
				continue
			}
			onUpdate(coins)
		}
	}()
}
