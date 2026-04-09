import { useState } from 'react';
import type { PriceAlert, Coin } from '../types';

interface PriceAlertsProps {
  alerts: PriceAlert[];
  coins: Coin[];
  onDelete?: (id: string) => void;
  onCreate?: (coinId: string, targetPrice: number, condition: 'above' | 'below') => void;
}

export function PriceAlerts({ alerts, coins, onDelete, onCreate }: PriceAlertsProps) {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const coinMap = new Map(coins.map((c) => [c.id, c]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin || !targetPrice || !onCreate) return;

    onCreate(selectedCoin, parseFloat(targetPrice), condition);
    setSelectedCoin('');
    setTargetPrice('');
    setCondition('above');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Create Alert Form */}
      {onCreate && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Create New Alert</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Coin</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                required
              >
                <option value="">Select coin</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Target Price (USD)</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="0.00"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 transition-colors"
              >
                Create Alert
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No alerts set. Create one above to get notified when prices change.
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const coin = coinMap.get(alert.coin_id);
            return (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  alert.is_triggered ? 'bg-green-900/30 border border-green-700' : 'bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-medium">
                      {coin?.name || alert.coin_id}
                    </span>
                    {coin && (
                      <span className="text-gray-400 uppercase text-sm ml-2">
                        {coin.symbol}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400">
                    {alert.condition === 'above' ? 'goes above' : 'goes below'}
                  </div>
                  <div className="font-mono">{formatPrice(alert.target_price)}</div>
                  {alert.is_triggered && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      TRIGGERED
                    </span>
                  )}
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(alert.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Delete alert"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
