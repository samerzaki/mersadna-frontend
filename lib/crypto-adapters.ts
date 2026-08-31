// Adapters for transforming crypto API responses to frontend types

import type {
  CryptoApiItem,
  CryptoTopApiItem,
  CryptoPrice,
  CryptoApiPagination,
  CryptoPagination,
  CryptoMarketStats,
} from '@/types';

// Static Arabic name map for well-known coins
const ARABIC_NAMES: Record<string, string> = {
  bitcoin: 'بيتكوين',
  ethereum: 'إيثيريوم',
  tether: 'تيثر',
  binancecoin: 'بي إن بي',
  solana: 'سولانا',
  ripple: 'ريبل',
  cardano: 'كاردانو',
  dogecoin: 'دوجكوين',
  polkadot: 'بولكادوت',
  'matic-network': 'بوليجون',
  polygon: 'بوليجون',
  litecoin: 'لايتكوين',
  chainlink: 'تشين لينك',
  avalanche: 'أفالانش',
  uniswap: 'يوني سواب',
  stellar: 'ستيلر',
  cosmos: 'كوزموس',
  near: 'نير',
  algorand: 'ألجوراند',
  tron: 'ترون',
};

export function adaptCryptoApiItem(item: CryptoApiItem): CryptoPrice {
  return {
    id: item.coin_id,
    symbol: item.symbol,
    name: item.name,
    nameAr: ARABIC_NAMES[item.coin_id],
    image: item.image,
    price_usd: item.price_usd,
    change_24h: item.change_24h,
    change_7d: item.change_7d,
    volume_24h: item.volume_24h,
    market_cap: item.market_cap,
    rank: item.rank,
    chart_points: item.sparkline_7d ?? [],
    last_updated: item.recorded_at,
  };
}

export function adaptCryptoTopItem(item: CryptoTopApiItem): CryptoPrice {
  return {
    id: item.coin_id,
    symbol: item.symbol,
    name: item.name,
    nameAr: ARABIC_NAMES[item.coin_id],
    image: item.image,
    price_usd: item.price_usd,
    change_24h: item.change_24h,
    change_7d: 0,
    volume_24h: item.volume_24h,
    market_cap: item.market_cap,
    rank: item.rank,
    chart_points: [],
    last_updated: new Date().toISOString(),
  };
}

export function adaptCryptoPagination(p: CryptoApiPagination): CryptoPagination {
  return {
    currentPage: p.currentPage,
    totalPages: p.totalPages,
    totalItems: p.total,
    perPage: p.perPage,
    hasNextPage: p.currentPage < p.totalPages,
    hasPreviousPage: p.currentPage > 1,
  };
}

export function computeMarketStats(
  cryptos: CryptoPrice[],
  totalCount: number
): CryptoMarketStats {
  const totalMarketCap = cryptos.reduce((sum, c) => sum + c.market_cap, 0);
  const totalVolume = cryptos.reduce((sum, c) => sum + c.volume_24h, 0);
  const btc = cryptos.find(c => c.symbol === 'BTC');
  const eth = cryptos.find(c => c.symbol === 'ETH');

  return {
    total_market_cap: totalMarketCap,
    total_volume_24h: totalVolume,
    btc_dominance: btc && totalMarketCap > 0
      ? (btc.market_cap / totalMarketCap) * 100
      : 0,
    eth_dominance: eth && totalMarketCap > 0
      ? (eth.market_cap / totalMarketCap) * 100
      : 0,
    active_cryptos: totalCount,
    markets: 0,
  };
}
