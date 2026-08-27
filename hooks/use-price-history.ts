// Hook for fetching price history
// NOTE: These endpoints are deprecated and not in the new API
// Using fallback to overview data for now

import { useQuery } from '@tanstack/react-query';
import { fetchGoldOverview } from '@/lib/api';
import { KaratCode, PriceHistory } from '@/types';

/**
 * Fetch price history with optional filters
 * @deprecated - This endpoint is not available in the new API
 * Returns empty array for now. Use useGoldOverview() instead.
 */
export function usePriceHistory(
  karat?: KaratCode,
  from?: string,
  to?: string,
  limit?: number
) {
  return useQuery({
    queryKey: ['price-history', karat, from, to, limit],
    queryFn: async (): Promise<PriceHistory[]> => {
      // TODO: Replace with actual API endpoint when available
      console.warn('usePriceHistory: This endpoint is deprecated. Use useGoldOverview() instead.');
      return [];
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Fetch chart data for specified time range
 * @deprecated - This endpoint is not available in the new API
 * Returns empty array for now. Use useGoldOverview() for chart_points instead.
 */
export function useChartData(days: number, karats?: KaratCode[]) {
  return useQuery({
    queryKey: ['chart-data', days, karats],
    queryFn: async (): Promise<PriceHistory[]> => {
      // TODO: Replace with actual API endpoint when available
      console.warn('useChartData: This endpoint is deprecated. Use useGoldOverview() for chart data instead.');
      return [];
    },
    staleTime: 60000,
  });
}
