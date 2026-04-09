import type { Coin } from '../types';

interface CoinListProps {
  coins: Coin[];
  watchlistCoinIds: Set<string>;
  onAddToWatchlist?: (coinId: string) => void;
}

export function CoinList({ coins, watchlistCoinIds, onAddToWatchlist }: CoinListProps) {
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

  if (coins.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Waiting for price data...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700">
            <th className="pb-3 pr-4">#</th>
            <th className="pb-3 pr-4">Name</th>
            <th className="pb-3 pr-4 text-right">Price</th>
            <th className="pb-3 pr-4 text-right">24h Change</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr
              key={coin.id}
              className="border-b border-gray-800 hover:bg-gray-800/50"
            >
              <td className="py-4 pr-4 text-gray-400">{index + 1}</td>
              <td className="py-4 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-gray-400 uppercase text-sm">
                    {coin.symbol}
                  </span>
                </div>
              </td>
              <td className="py-4 pr-4 text-right font-mono">
                {formatPrice(coin.current_price)}
              </td>
              <td
                className={`py-4 pr-4 text-right font-mono ${
                  coin.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {formatPercent(coin.price_change_percentage_24h)}
              </td>
              <td className="py-4 text-right">
                {onAddToWatchlist && !watchlistCoinIds.has(coin.id) && (
                  <button
                    onClick={() => onAddToWatchlist(coin.id)}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    + Watch
                  </button>
                )}
                {watchlistCoinIds.has(coin.id) && (
                  <span className="text-sm text-gray-500">Watching</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
