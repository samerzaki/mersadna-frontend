// React Query hooks for Portfolio API

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '@/lib/api-portfolio';
import type {
  CreatePortfolioItemRequest,
  UpdatePortfolioItemRequest,
} from '@/types/portfolio';
import { REFRESH_INTERVAL } from '@/lib/constants';

/**
 * Fetch all portfolio items with summary and counts.
 * Always fetches type=all so the frontend can filter client-side
 * while keeping summary/counts for the full portfolio.
 */
export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: () => fetchPortfolio('all'),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 30000,
  });
}

/**
 * Create a new portfolio item.
 * Invalidates the portfolio query on success.
 */
export function useCreatePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePortfolioItemRequest) => createPortfolioItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}

/**
 * Update an existing portfolio item.
 * Invalidates the portfolio query on success.
 */
export function useUpdatePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePortfolioItemRequest }) =>
      updatePortfolioItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}

/**
 * Delete a portfolio item.
 * Invalidates the portfolio query on success.
 */
export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}
