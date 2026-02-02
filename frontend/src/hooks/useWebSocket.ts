import { useEffect, useRef, useState } from 'react';
import { PriceUpdate } from '../types';

const WS_URL = 'ws://localhost:8080/ws';

export function useWebSocket() {
  const [prices, setPrices] = useState<Map<string, number>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // TODO: Implement WebSocket connection
    // 1. Create WebSocket connection to WS_URL
    // 2. Handle onopen, onclose, onerror events
    // 3. Handle onmessage to parse PriceUpdate and update prices state
    // 4. Implement reconnection logic

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { prices, isConnected };
}
