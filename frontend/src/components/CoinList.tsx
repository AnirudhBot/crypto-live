import { Coin } from '../types';

interface CoinListProps {
  coins: Coin[];
  onAddToWatchlist?: (coinId: string) => void;
}

export function CoinList({ coins, onAddToWatchlist }: CoinListProps) {
  // TODO: Implement coin list table/grid
  // Display: name, symbol, current price, 24h change
  // Add button to add coin to watchlist
  return (
    <div>
      {/* Implement coin list here */}
    </div>
  );
}
