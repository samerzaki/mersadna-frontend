// Gold-related type definitions

import type { SilverOverviewItem } from './silver';

export type KaratCode = 'k24' | 'k21' | 'k18';

// Extended to include all gold product types from API
export type GoldProductType = '21' | '24' | '18' | 'gold_pound' | 'ounce';

export interface Karat {
  id: number;
  code: KaratCode;
  name: string;
  purity: number;
}

export interface GoldPrice {
  karat: KaratCode;
  name: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface PriceHistory {
  id: number;
  karat: KaratCode;
  buyPrice: number;
  sellPrice: number;
  change: number;
  changePercent: number;
  recordedAt: string;
}

export interface ChartDataPoint {
  timestamp: string;
  date: string;
  k24?: number;
  k21?: number;
  k18?: number;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

// API Response types based on Postman collection
export interface GoldOverviewItem {
  currency: string;
  price: {
    buy: number;
    sell: number;
  };
  spread: {
    egp: number;
    percent: number;
  };
  change: {
    value: number;
    percent: number;
    color: 'red' | 'green';
  };
  chart_points: number[];
  chart_color: string;
  last_checked: {
    last_checked_at: string;
    last_checked_at_for_human: string;
    live: boolean;
  };
}

/** The overview endpoint currently returns no ounce quote when it is unavailable. */
export type GoldOunceItem = GoldOverviewItem;

export interface GoldOverviewResponse {
  status: number;
  success: boolean;
  data: {
    gold: {
      '21': GoldOverviewItem | null;
      gold_pound: GoldOverviewItem | null;
      '24': GoldOverviewItem | null;
      '18': GoldOverviewItem | null;
      ounce: GoldOunceItem | null;
    };
    silver: {
      '999_swiss': SilverOverviewItem | null;
      '999_egyptian': SilverOverviewItem | null;
      '925': SilverOverviewItem | null;
      '800': SilverOverviewItem | null;
      ounce: SilverOverviewItem | null;
    };
  };
}

export interface GoldAllPricesResponse {
  status: number;
  success: boolean;
  data: {
    gold: Record<string, GoldOverviewItem>;
  };
}

// Gold History API response types
export interface GoldHistoryChartPoint {
  date: string;
  price: number;
}

export interface GoldHistoryKaratData {
  currency: string;
  sell_price: number;
  buy_price: number;
  spread_egp: number;
  spread_percent: number;
  chart_points: GoldHistoryChartPoint[];
  chart_color: string;
  recorded_at: string;
}

// USD exchange rate chart point
export interface UsdRateChartPoint {
  date: string;
  sell_rate: number;
  buy_rate: number;
}

// USD exchange rate history data
export interface UsdRatesHistory {
  from_currency: string;
  to_currency: string;
  average_sell_rate: number;
  average_buy_rate: number;
  highest_sell_rate: number;
  lowest_sell_rate: number;
  highest_buy_rate: number;
  lowest_buy_rate: number;
  chart_points: UsdRateChartPoint[];
}

export interface GoldHistoryResponse {
  status: number;
  success: boolean;
  data: {
    period: '24h' | '7d' | '30d' | '1y' | 'all';
    currency: string;
    karat_24: GoldHistoryKaratData;
    karat_21: GoldHistoryKaratData;
    karat_18: GoldHistoryKaratData;
    usd_rates?: UsdRatesHistory;
  };
  meta: {
    message: string;
  };
}
