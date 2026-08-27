// React Query hooks for Currency API - Nezzel Gold

import { useQuery } from '@tanstack/react-query';
import {
  fetchHighestBuyPrice,
  fetchHighestSellPrice,
  fetchCurrencyAverages,
  fetchCurrencyBanks,
  fetchBlackMarketRates,
} from '@/lib/api';
import { REFRESH_INTERVAL } from '@/lib/constants';
import type { CurrencyPrice } from '@/types';

/**
 * Get highest buy price for a currency across all banks
 *
 * @param currency - Currency code (default: USD)
 */
export function useHighestBuyPrice(currency: string = 'USD', enabled: boolean = true) {
  return useQuery({
    queryKey: ['currency-highest-buy', currency],
    queryFn: () => fetchHighestBuyPrice(currency),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
    enabled,
  });
}

/**
 * Get highest sell price for a currency across all banks
 *
 * @param currency - Currency code (default: USD)
 */
export function useHighestSellPrice(currency: string = 'USD', enabled: boolean = true) {
  return useQuery({
    queryKey: ['currency-highest-sell', currency],
    queryFn: () => fetchHighestSellPrice(currency),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
    enabled,
  });
}

/**
 * Get currency averages from banks and parallel market
 *
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code (default: EGP)
 */
export function useCurrencyAverages(
  fromCurrency: string,
  toCurrency: string = 'EGP',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['currency-averages', fromCurrency, toCurrency],
    queryFn: () => fetchCurrencyAverages(fromCurrency, toCurrency),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
    enabled,
  });
}

/**
 * Get all bank rates for a specific currency with chart data
 *
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code (default: EGP)
 * @param period - Time period for charts (default: 24h)
 */
export function useCurrencyBanks(
  fromCurrency: string,
  toCurrency: string = 'EGP',
  period: '24h' | '7d' | '30d' = '24h',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['currency-banks', fromCurrency, toCurrency, period],
    queryFn: () => fetchCurrencyBanks(fromCurrency, toCurrency, period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
    enabled,
  });
}

/**
 * Get black market (parallel market) currency rates
 *
 * @param currency - Optional currency code filter (e.g., USD, EUR)
 * @param toCurrency - Target currency code (default: EGP)
 */
export function useBlackMarketRates(
  currency?: string,
  toCurrency: string = 'EGP',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['black-market-rates', currency, toCurrency],
    queryFn: () => fetchBlackMarketRates(currency, toCurrency),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
    enabled,
  });
}

/**
 * @deprecated This hook is deprecated and returns empty data.
 * Use useCurrencyAverages(), useHighestBuyPrice(), or useHighestSellPrice() instead.
 *
 * For displaying multiple currencies, fetch them individually in parallel.
 */
export function useCurrencyPrices() {
  return useQuery<CurrencyPrice[]>({
    queryKey: ['currency-prices-deprecated'],
    queryFn: async () => {
      console.warn('useCurrencyPrices is deprecated. Use the new specific hooks instead.');
      return [] as CurrencyPrice[];
    },
    enabled: false, // Disabled to prevent unnecessary API calls
    refetchInterval: 0,
  });
}
