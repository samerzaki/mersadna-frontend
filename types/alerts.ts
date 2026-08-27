// Alert-related type definitions

export interface PriceAlert {
  id: string;
  type: 'gold' | 'currency';
  productCode: string; // e.g., 'k24', 'USD'
  productName: string; // e.g., 'عيار 24', 'دولار'
  targetPrice: number; // the price threshold for the alert
  condition: 'below' | 'above'; // trigger when price goes below/above
  currentPrice?: number; // last known price
  isActive: boolean; // whether alert is active (enabled)
  isTriggered: boolean; // whether alert condition was met
  createdAt: string;
  triggeredAt?: string;
  lastChecked?: string; // last time price was checked against this alert
}

export type AlertProduct = {
  code: string;
  name: string;
  type: 'gold' | 'currency';
  currentPrice?: number;
};