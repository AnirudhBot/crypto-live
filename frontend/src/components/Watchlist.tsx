import { WatchlistItem, Coin } from '../types';

interface WatchlistProps {
  items: WatchlistItem[];
  coins: Coin[];
  onRemove?: (id: string) => void;
}

export function Watchlist({ items, coins, onRemove }: WatchlistProps) {
  // TODO: Implement watchlist display
  // Show watched coins with current prices
  // Add remove button for each item
  return (
    <div>
      {/* Implement watchlist here */}
    </div>
  );
}
