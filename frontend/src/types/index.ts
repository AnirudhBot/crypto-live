export interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
}

export interface WatchlistItem {
  id: string;
  coin_id: string;
}

export interface PriceAlert {
  id: string;
  coin_id: string;
  target_price: number;
  condition: 'above' | 'below';
  is_triggered: boolean;
}

export interface PriceUpdate {
  coin_id: string;
  price: number;
}
