// Silver-related type definitions

export type SilverProductKey = '999_swiss' | '999_egyptian' | '925' | '800' | 'ounce';

// Standard silver product item (EGP-based products)
export interface SilverOverviewItem {
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
    value: number | null;
    percent: number | null;
    color: 'red' | 'green' | 'gray' | null;
  };
  chart_points: number[];
  chart_color: string;
  last_checked: {
    last_checked_at: string | null;
    last_checked_at_for_human: string | null;
    live: boolean;
  };
}

export type SilverOunceItem = SilverOverviewItem;

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
    silver: Record<string, SilverAllPricesItem>;
  };
}

/** The get-all-prices endpoint still exposes its legacy flat fields. */
export interface SilverAllPricesItem {
  currency: string;
  sell_price: number;
  buy_price: number;
  spread_egp: number;
  spread_percent: number;
  chart_points: number[];
  chart_color: string;
  recorded_at: string;
}
