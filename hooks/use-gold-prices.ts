// React Query hooks for the Mersadna API

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchGoldOverview, fetchAllGoldPrices, fetchGoldCalculation, fetchGoldHistory } from '@/lib/api';
import { GoldPrice, KaratCode } from '@/types';
import { REFRESH_INTERVAL } from '@/lib/constants';

/**
 * Fetch gold overview for home page
 * 
 * Returns prices for the 5 main products:
 * - 21k, 24k, 18k, gold pound, ounce
 */
export function useGoldOverview() {
  return useQuery({
    queryKey: ['gold-overview'],
    queryFn: fetchGoldOverview,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Fetch all gold prices with filters
 * 
 * @param currency - Currency code (default: "EGP")
 * @param period - Time period: "24h" | "7d" | "30d" (default: "30d")
 */
export function useAllGoldPrices(currency: string = 'EGP', period: '24h' | '7d' | '30d' = '30d') {
  return useQuery({
    queryKey: ['all-gold-prices', currency, period],
    queryFn: () => fetchAllGoldPrices(currency, period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
  });
}

/**
 * @deprecated - Use useGoldOverview() instead
 * This endpoint is not available in the new API
 */
export function useGoldPrices() {
  return useQuery({
    queryKey: ['gold-prices-deprecated'],
    queryFn: async (): Promise<GoldPrice[]> => {
      console.warn('useGoldPrices: This hook is deprecated. Use useGoldOverview() instead.');
      return [];
    },
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
  });
}

/**
 * @deprecated - Use useGoldOverview() instead
 * This endpoint is not available in the new API
 */
export function useKaratPrice(karat: KaratCode) {
  return useQuery({
    queryKey: ['gold-price-deprecated', karat],
    queryFn: async (): Promise<GoldPrice | undefined> => {
      console.warn('useKaratPrice: This hook is deprecated. Use useGoldOverview() instead.');
      return undefined;
    },
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
  });
}

/**
 * Calculate gold value in real-time
 * Only fetches when grams > 0
 *
 * @param grams - Weight in grams
 * @param karat - Gold karat (18, 21, or 24)
 * @param enabled - Enable/disable query (default: grams > 0)
 */
export function useGoldCalculator(
  grams: number,
  karat: 18 | 21 | 24 = 21,
  enabled: boolean = grams > 0
) {
  return useQuery({
    queryKey: ['gold-calculator', grams, karat],
    queryFn: () => fetchGoldCalculation(grams, karat),
    enabled,
    staleTime: 30000,
    refetchInterval: REFRESH_INTERVAL,
  });
}

/**
 * Fetch gold price history for all karats (24k, 21k, 18k)
 * Returns historical prices with chart data
 *
 * @param period - Time period: "24h" | "7d" | "30d" | "1y" | "all" (default: "30d")
 * @param currency - Currency code (default: "EGP")
 * @param includeUsdRates - Include USD exchange rate history (default: false)
 */
export function useGoldHistory(
  period: '24h' | '7d' | '30d' | '1y' | 'all' = '30d',
  currency: string = 'EGP',
  includeUsdRates: boolean = false
) {
  return useQuery({
    queryKey: ['gold-history', period, currency, includeUsdRates],
    queryFn: () => fetchGoldHistory(period, currency, includeUsdRates),
    staleTime: 30000,
    refetchInterval: REFRESH_INTERVAL,
    placeholderData: keepPreviousData,
  });
}
