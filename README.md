# Crypto Live

A real-time cryptocurrency price tracker that streams live market data to the browser via WebSockets. Track the top 50 coins by market cap, build a personal watchlist, and set price alerts that trigger automatically.

## Features

- **Live prices** — top 50 coins polled from CoinGecko every 30 seconds, broadcast to all clients instantly via WebSocket
- **Watchlist** — add/remove coins to a personal watchlist
- **Price alerts** — create above/below threshold alerts; triggered alerts are highlighted in the UI in real-time

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Go 1.25, Gin, Gorilla WebSocket |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Data Source | CoinGecko public API |

## Running Locally

### Prerequisites

- Go 1.21+
- Node.js 18+

### Backend

```bash
cd backend
go run ./cmd/server
# Server starts on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Dev server starts on http://localhost:5173
```
