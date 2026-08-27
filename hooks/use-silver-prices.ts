// React Query hooks for Silver API

import { useQuery } from '@tanstack/react-query';
import { fetchSilverOverview, fetchAllSilverPrices } from '@/lib/api';
import { REFRESH_INTERVAL } from '@/lib/constants';

/**
 * Fetch silver overview for home page
 *
 * Returns prices for:
 * - 999 Swiss, 999 Egyptian, 925, 800, Ounce (USD)
 */
export function useSilverOverview() {
  return useQuery({
    queryKey: ['silver-overview'],
    queryFn: fetchSilverOverview,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
  });
}

/**
 * Fetch all silver prices with filters
 *
 * @param currency - Currency code (default: "EGP")
 * @param period - Time period: "24h" | "7d" | "30d" (default: "30d")
 */
export function useAllSilverPrices(currency: string = 'EGP', period: '24h' | '7d' | '30d' = '30d') {
  return useQuery({
    queryKey: ['all-silver-prices', currency, period],
    queryFn: () => fetchAllSilverPrices(currency, period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
  });
}
