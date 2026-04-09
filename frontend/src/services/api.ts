import type { Coin, WatchlistItem, PriceAlert } from '../types';

const API_URL = 'http://localhost:8080/api';

export async function fetchCoins(): Promise<Coin[]> {
  const response = await fetch(`${API_URL}/coins`);
  if (!response.ok) {
    throw new Error('Failed to fetch coins');
  }
  return response.json();
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const response = await fetch(`${API_URL}/watchlist`);
  if (!response.ok) {
    throw new Error('Failed to fetch watchlist');
  }
  return response.json();
}

export async function addToWatchlist(coinId: string): Promise<WatchlistItem> {
  const response = await fetch(`${API_URL}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coin_id: coinId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add to watchlist');
  }
  return response.json();
}

export async function removeFromWatchlist(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/watchlist/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove from watchlist');
  }
}

export async function fetchAlerts(): Promise<PriceAlert[]> {
  const response = await fetch(`${API_URL}/alerts`);
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
}

export async function createAlert(
  coinId: string,
  targetPrice: number,
  condition: 'above' | 'below'
): Promise<PriceAlert> {
  const response = await fetch(`${API_URL}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coin_id: coinId,
      target_price: targetPrice,
      condition,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create alert');
  }
  return response.json();
}

export async function deleteAlert(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/alerts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete alert');
  }
}
