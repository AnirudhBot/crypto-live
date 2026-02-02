import { PriceAlert } from '../types';

interface PriceAlertsProps {
  alerts: PriceAlert[];
  onDelete?: (id: string) => void;
  onCreate?: (coinId: string, targetPrice: number, condition: 'above' | 'below') => void;
}

export function PriceAlerts({ alerts, onDelete, onCreate }: PriceAlertsProps) {
  // TODO: Implement price alerts UI
  // Display existing alerts with status
  // Form to create new alert (coin selector, target price, condition)
  // Delete button for each alert
  return (
    <div>
      {/* Implement price alerts here */}
    </div>
  );
}
