// Cryptocurrency-related type definitions

// =============================================================================
// Frontend types (consumed by components)
// =============================================================================

export interface CryptoPrice {
  id: string;
  symbol: string; // BTC, ETH, USDT, etc.
  name: string; // Bitcoin, Ethereum, Tether, etc.
  nameAr?: string; // بيتكوين, إيثيريوم, تيثر, etc. (optional - from static map)
  image?: string; // Coin image URL from API
  price_usd: number;
  price_egp?: number; // Optional local currency
  change_24h: number; // Percentage change
  change_7d: number; // 7-day percentage change
  volume_24h: number; // 24h trading volume in USD
  market_cap: number; // Market capitalization in USD
  rank: number; // Market rank
  chart_points: number[]; // Mini chart data points (sparkline)
  last_updated: string;
}

export interface CryptoMarketStats {
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
  eth_dominance: number;
  active_cryptos: number;
  markets: number;
}

export interface CryptoHistory {
  timestamp: string;
  price_usd: number;
  volume: number;
}

export type CryptoTimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

export type FeaturedCrypto = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'XRP';

// =============================================================================
// Pagination types
// =============================================================================

export interface CryptoPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CryptoPaginatedResult {
  cryptos: CryptoPrice[];
  pagination: CryptoPagination;
}

// =============================================================================
// API response types (raw shapes from the backend)
// =============================================================================

export interface CryptoApiItem {
  coin_id: string;
  symbol: string;
  name: string;
  image: string;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number;
  change_7d: number;
  rank: number;
  sparkline_7d: number[];
  recorded_at: string;
}

export interface CryptoTopApiItem {
  coin_id: string;
  symbol: string;
  name: string;
  image: string;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number;
  trend: 'up' | 'down';
  rank: number;
}

export interface CryptoApiPagination {
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface CryptoListApiResponse {
  status: number;
  success: boolean;
  data: CryptoApiItem[];
  message: string;
  pagination: CryptoApiPagination;
}

export interface CryptoTopApiResponse {
  status: number;
  success: boolean;
  data: CryptoTopApiItem[];
  meta: {
    message: string;
  };
}
