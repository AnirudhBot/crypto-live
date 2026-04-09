import type { WatchlistItem, Coin } from '../types';

interface WatchlistProps {
  items: WatchlistItem[];
  coins: Coin[];
  onRemove?: (id: string) => void;
}

export function Watchlist({ items, coins, onRemove }: WatchlistProps) {
  const coinMap = new Map(coins.map((c) => [c.id, c]));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Your watchlist is empty. Add coins from the list above.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const coin = coinMap.get(item.coin_id);
        if (!coin) return null;

        return (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{coin.name}</span>
                <span className="text-gray-400 uppercase text-sm">
                  {coin.symbol}
                </span>
              </div>
              <div className="mt-1 font-mono text-lg">
                {formatPrice(coin.current_price)}
              </div>
              <div
                className={`text-sm font-mono ${
                  coin.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {formatPercent(coin.price_change_percentage_24h)}
              </div>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Remove from watchlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
