import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCryptoList, fetchCryptoTop } from '@/lib/api';
import {
  adaptCryptoApiItem,
  adaptCryptoTopItem,
  adaptCryptoPagination,
  computeMarketStats,
} from '@/lib/crypto-adapters';
import { REFRESH_INTERVAL } from '@/lib/constants';
import type { CryptoPaginatedResult, CryptoPrice, CryptoMarketStats } from '@/types';

/**
 * Fetch paginated crypto list from real API
 * Returns adapted CryptoPrice[] plus pagination metadata
 */
export function useCryptoPrices(page: number = 1, perPage: number = 20) {
  return useQuery<CryptoPaginatedResult>({
    queryKey: ['crypto-prices', page, perPage],
    queryFn: async () => {
      const response = await fetchCryptoList(page, perPage);
      return {
        cryptos: response.data.map(adaptCryptoApiItem),
        pagination: adaptCryptoPagination(response.pagination),
      };
    },
    staleTime: 30000,
    gcTime: 300000,
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

/**
 * Fetch top/featured cryptocurrencies (top 3)
 */
export function useCryptoTop() {
  return useQuery<CryptoPrice[]>({
    queryKey: ['crypto-top'],
    queryFn: async () => {
      const response = await fetchCryptoTop();
      return response.data.map(adaptCryptoTopItem);
    },
    staleTime: 30000,
    gcTime: 300000,
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

/**
 * Compute market stats derived from the crypto list data
 */
export function useCryptoMarketStats() {
  const query = useCryptoPrices(1, 50);

  const stats: CryptoMarketStats | undefined = query.data
    ? computeMarketStats(query.data.cryptos, query.data.pagination.totalItems)
    : undefined;

  return {
    data: stats,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}
