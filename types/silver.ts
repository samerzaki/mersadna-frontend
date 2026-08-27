// Silver-related type definitions

export type SilverProductKey = '999_swiss' | '999_egyptian' | '925' | '800' | 'ounce';

// Standard silver product item (EGP-based products)
export interface SilverOverviewItem {
  currency: string;
  sell_price: number;
  buy_price: number;
  spread_egp: number;
  spread_percent: number;
  chart_points: number[];
  chart_color: string;
  recorded_at: string;
}

// Ounce has a simplified structure (USD, no spread/chart data)
export interface SilverOunceItem {
  buy_price: number;
  sell_price: number;
  currency: string;
  recorded_at: string;
}

export interface SilverOverviewResponse {
  status: number;
  success: boolean;
  data: {
    silver: {
      '999_swiss': SilverOverviewItem | null;
      '999_egyptian': SilverOverviewItem | null;
      '925': SilverOverviewItem | null;
      '800': SilverOverviewItem | null;
      ounce: SilverOunceItem | null;
    };
  };
}

export interface SilverAllPricesResponse {
  status: number;
  success: boolean;
  data: {
    silver: Record<string, SilverOverviewItem>;
  };
}
