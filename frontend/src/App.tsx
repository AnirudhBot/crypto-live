function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 p-4">
        <h1 className="text-2xl font-bold">Crypto Live</h1>
      </header>

      <main className="container mx-auto p-4">
        {/* TODO: Add CoinList component */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Live Prices</h2>
          <p className="text-gray-400">Implement CoinList component here</p>
        </section>

        {/* TODO: Add Watchlist component */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
          <p className="text-gray-400">Implement Watchlist component here</p>
        </section>

        {/* TODO: Add PriceAlerts component */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Price Alerts</h2>
          <p className="text-gray-400">Implement PriceAlerts component here</p>
        </section>
      </main>
    </div>
  )
}

export default App
