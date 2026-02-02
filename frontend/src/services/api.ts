const API_URL = 'http://localhost:8080/api';

// TODO: Implement API functions

export async function fetchCoins() {
  // GET /api/coins
}

export async function fetchWatchlist() {
  // GET /api/watchlist
}

export async function addToWatchlist(coinId: string) {
  // POST /api/watchlist
}

export async function removeFromWatchlist(id: string) {
  // DELETE /api/watchlist/:id
}

export async function fetchAlerts() {
  // GET /api/alerts
}

export async function createAlert(coinId: string, targetPrice: number, condition: 'above' | 'below') {
  // POST /api/alerts
}

export async function deleteAlert(id: string) {
  // DELETE /api/alerts/:id
}
