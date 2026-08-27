// Currency-related type definitions

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  flag: string;
  displayOrder: number;
}

export interface CurrencyPrice {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  price: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

export interface CurrencyHistory {
  id: number;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  recordedAt: string;
}

// Gold Calculator Types
export interface GoldCalculateParams {
  grams: number;
  karat: 18 | 21 | 24;
}

export interface GoldCalculateResponse {
  status: number;
  success: boolean;
  data: {
    grams: number;
    karat: number;
    currency: string;
    price_per_gram: number;
    total_value: number;
    recorded_at: string;
  };
  meta?: {
    message: string;
  };
}

// Currency Highest Buy/Sell Price Types
export interface CurrencyHighestPriceResponse {
  status: number;
  success: boolean;
  data: {
    price: string;
    from_currency: string;
    to_currency: string;
    bank: {
      id: number;
      code: string;
      name: string;
      english_name: string;
      arabic_name: string;
      bank_logo_url: string;
    };
    recorded_at: string;
    last_update_at: string;
  };
  meta: {
    message: string;
    currency: string;
  };
}

// Currency Averages Types
export interface CurrencyAveragesResponse {
  status: number;
  success: boolean;
  data: {
    from_currency: string;
    to_currency: string;
    banks: {
      avg_buy_rate: number;
      avg_sell_rate: number;
      count: number;
      last_update_at: string;
    };
    parallel_market: {
      avg_buy_rate: number;
      avg_sell_rate: number;
      count: number;
      last_update_at: string;
    };
  };
  meta: {
    message: string;
  };
}

// Currency Banks Types
export interface CurrencyBankChart {
  trend: 'up' | 'down' | 'stable';
  color: 'green' | 'red' | 'gray';
  data: Array<{
    timestamp: string;
    buy_rate: number;
    sell_rate: number;
    mid_rate: number;
  }>;
}

export interface CurrencyBank {
  id: number;
  code: string;
  name: string;
  english_name: string;
  arabic_name: string;
  bank_logo_url: string;
  latest_buy_rate: number;
  latest_sell_rate: number;
  difference: number;
  difference_percentage: number;
  chart: CurrencyBankChart;
  last_update_at: string;
}

export interface CurrencyBanksResponse {
  status: number;
  success: boolean;
  data: {
    from_currency: string;
    to_currency: string;
    period: string;
    banks: CurrencyBank[];
  };
  meta: {
    message: string;
  };
}

// Black Market (Parallel Market) Types
export interface BlackMarketRate {
  currency: string;
  buy_rate: number;
  sell_rate: number;
  mid_rate: number;
  last_updated: string;
}

export interface BlackMarketResponse {
  status: number;
  success: boolean;
  data: {
    source: string;
    source_english_name: string;
    source_arabic_name: string;
    to_currency: string;
    last_update_at: string;
    rates: BlackMarketRate[];
  };
  meta: {
    message: string;
  };
}
