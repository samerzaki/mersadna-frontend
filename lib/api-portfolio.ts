// Portfolio API functions - authenticated endpoints

import { apiFetch, getAuthHeaders, ApiError } from './auth-utils';
import { API_BASE_URL } from './constants';
import type {
  PortfolioIndexResponse,
  PortfolioItemResponse,
  CreatePortfolioItemRequest,
  UpdatePortfolioItemRequest,
} from '@/types/portfolio';

/**
 * Fetch portfolio items with live valuations + summary
 * GET /api/asset-portfolio?type=all
 */
export async function fetchPortfolio(
  type: string = 'all'
): Promise<PortfolioIndexResponse> {
  return apiFetch<PortfolioIndexResponse>(`/asset-portfolio?type=${type}`);
}

/**
 * Create a new portfolio item
 * POST /api/asset-portfolio
 */
export async function createPortfolioItem(
  data: CreatePortfolioItemRequest
): Promise<PortfolioItemResponse> {
  return apiFetch<PortfolioItemResponse>('/asset-portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing portfolio item
 * PUT /api/asset-portfolio/:id
 */
export async function updatePortfolioItem(
  id: number,
  data: UpdatePortfolioItemRequest
): Promise<PortfolioItemResponse> {
  return apiFetch<PortfolioItemResponse>(`/asset-portfolio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a portfolio item
 * DELETE /api/asset-portfolio/:id
 *
 * Handles both HTTP 204 (no body) and HTTP 200 (with body) responses.
 */
export async function deletePortfolioItem(id: number): Promise<void> {
  const headers = getAuthHeaders(false);

  const response = await fetch(`${API_BASE_URL}/asset-portfolio/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });

  if (!response.ok && response.status !== 204) {
    let errorMessage = 'فشل حذف العنصر';
    try {
      const errorData = await response.json();
      if (errorData.error?.message) errorMessage = errorData.error.message;
      else if (errorData.message) errorMessage = errorData.message;
    } catch {
      // not JSON
    }
    throw new ApiError(errorMessage, response.status);
  }
}
