import { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { CoinList } from './components/CoinList';
import { Watchlist } from './components/Watchlist';
import { PriceAlerts } from './components/PriceAlerts';
import {
  fetchWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  fetchAlerts,
  createAlert,
  deleteAlert,
} from './services/api';
import type { WatchlistItem, PriceAlert } from './types';

function App() {
  const { coins, isConnected, triggeredAlerts, clearTriggeredAlerts } = useWebSocket();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  // Load watchlist and alerts on mount
  useEffect(() => {
    fetchWatchlist().then(setWatchlist).catch(console.error);
    fetchAlerts().then(setAlerts).catch(console.error);
  }, []);

  // Update alerts when triggered via WebSocket
  useEffect(() => {
    if (triggeredAlerts.length > 0) {
      setAlerts((prev) =>
        prev.map((alert) => {
          const triggered = triggeredAlerts.find((t) => t.id === alert.id);
          return triggered ? { ...alert, is_triggered: true } : alert;
        })
      );
      clearTriggeredAlerts();
    }
  }, [triggeredAlerts, clearTriggeredAlerts]);

  const watchlistCoinIds = useMemo(
    () => new Set(watchlist.map((item) => item.coin_id)),
    [watchlist]
  );

  const handleAddToWatchlist = async (coinId: string) => {
    try {
      const item = await addToWatchlist(coinId);
      setWatchlist((prev) => [...prev, item]);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  const handleRemoveFromWatchlist = async (id: string) => {
    try {
      await removeFromWatchlist(id);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  const handleCreateAlert = async (
    coinId: string,
    targetPrice: number,
    condition: 'above' | 'below'
  ) => {
    try {
      const alert = await createAlert(coinId, targetPrice, condition);
      setAlerts((prev) => [...prev, alert]);
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Crypto Live</h1>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Live Prices</h2>
          <CoinList
            coins={coins}
            watchlistCoinIds={watchlistCoinIds}
            onAddToWatchlist={handleAddToWatchlist}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
          <Watchlist
            items={watchlist}
            coins={coins}
            onRemove={handleRemoveFromWatchlist}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Price Alerts</h2>
          <PriceAlerts
            alerts={alerts}
            coins={coins}
            onCreate={handleCreateAlert}
            onDelete={handleDeleteAlert}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
