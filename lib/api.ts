// API client functions - Nezzel Gold API

import {
  GoldOverviewResponse,
  GoldAllPricesResponse,
  GoldCalculateResponse,
  GoldHistoryResponse,
  CurrencyHighestPriceResponse,
  CurrencyAveragesResponse,
  CurrencyBanksResponse,
  NewsListResponse,
  NewsDetailResponse,
  NewsFeaturedResponse,
  NewsCategory,
  ApiNewsListResponse,
  ApiNewsDetailResponse,
  ApiRelatedNewsResponse,
  ApiCategoryItem,
  CryptoListApiResponse,
  CryptoTopApiResponse,
  SilverOverviewResponse,
  SilverAllPricesResponse,
  BlackMarketResponse,
} from '@/types';
import { API_BASE_URL } from './constants';
import { NEWS_PER_PAGE } from './news-constants';
import {
  adaptApiNewsToNewsItem,
  adaptApiPagination,
} from './news-adapters';

/**
 * Fetch gold overview (home page data)
 * GET /api/gold/get-overview
 * 
 * Returns prices for the 5 main gold products:
 * - 21 karat
 * - 24 karat  
 * - 18 karat
 * - Gold pound
 * - Ounce (USD)
 */
export async function fetchGoldOverview(): Promise<GoldOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/gold/get-overview`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch gold overview');
  }
  
  return await response.json();
}

/**
 * Fetch all gold prices with optional filters
 * GET /api/gold/get-all-prices
 * 
 * @param currency - Currency code (default: "EGP")
 * @param period - Time period: "24h" | "7d" | "30d" (default: "30d")
 * 
 * Returns overview-style details for all gold products with chart data
 */
export async function fetchAllGoldPrices(
  currency: string = 'EGP',
  period: '24h' | '7d' | '30d' = '30d'
): Promise<GoldAllPricesResponse> {
  const params = new URLSearchParams({
    currency,
    period,
  });
  
  const response = await fetch(`${API_BASE_URL}/gold/get-all-prices?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch all gold prices');
  }

  return await response.json();
}

/**
 * Calculate gold value
 * GET /api/gold/calculate?grams=3&karat=24
 *
 * @param grams - Weight in grams
 * @param karat - Gold karat (18, 21, or 24)
 */
export async function fetchGoldCalculation(
  grams: number,
  karat: 18 | 21 | 24
): Promise<GoldCalculateResponse> {
  const params = new URLSearchParams({
    grams: grams.toString(),
    karat: karat.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/gold/calculate?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to calculate gold value');
  }

  return await response.json();
}

/**
 * Fetch gold price history for all karats
 * GET /api/gold/gold-history
 *
 * @param period - Time period: "24h" | "7d" | "30d" | "1y" | "all" (default: "30d")
 * @param currency - Currency code (default: "EGP")
 * @param includeUsdRates - Include USD exchange rate history (default: false)
 *
 * Returns historical gold prices for 24k, 21k, and 18k with chart data
 * Optionally includes USD exchange rate history for comparing with gold prices
 */
export async function fetchGoldHistory(
  period: '24h' | '7d' | '30d' | '1y' | 'all' = '30d',
  currency: string = 'EGP',
  includeUsdRates: boolean = false
): Promise<GoldHistoryResponse> {
  const params = new URLSearchParams({
    period,
    currency,
  });

  // Add include_usd_rates parameter if requested
  if (includeUsdRates) {
    params.append('include_usd_rates', '1');
  }

  const response = await fetch(`${API_BASE_URL}/gold/gold-history?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch gold history');
  }

  return await response.json();
}

/**
 * Get highest buy price for currency
 * GET /api/currency/highest-buy-price?currency=USD
 *
 * @param currency - Currency code (e.g., USD, EUR)
 */
export async function fetchHighestBuyPrice(
  currency: string
): Promise<CurrencyHighestPriceResponse> {
  const params = new URLSearchParams({ currency });

  const response = await fetch(`${API_BASE_URL}/currency/highest-buy-price?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { status: 404, success: false, data: null as any, meta: { message: 'No data found', currency } };
    }
    throw new Error('Failed to fetch highest buy price');
  }

  return await response.json();
}

/**
 * Get highest sell price for currency
 * GET /api/currency/highest-sell-price?currency=USD
 *
 * @param currency - Currency code (e.g., USD, EUR)
 */
export async function fetchHighestSellPrice(
  currency: string
): Promise<CurrencyHighestPriceResponse> {
  const params = new URLSearchParams({ currency });

  const response = await fetch(`${API_BASE_URL}/currency/highest-sell-price?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { status: 404, success: false, data: null as any, meta: { message: 'No data found', currency } };
    }
    throw new Error('Failed to fetch highest sell price');
  }

  return await response.json();
}

/**
 * Get currency averages (banks + parallel market)
 * GET /api/currency/averages?from_currency=USD&to_currency=EGP
 *
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code (default: EGP)
 */
export async function fetchCurrencyAverages(
  fromCurrency: string,
  toCurrency: string = 'EGP'
): Promise<CurrencyAveragesResponse> {
  const params = new URLSearchParams({
    from_currency: fromCurrency,
    to_currency: toCurrency,
  });

  const response = await fetch(`${API_BASE_URL}/currency/averages?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        status: 404, success: false,
        data: { from_currency: fromCurrency, to_currency: toCurrency, banks: { avg_buy_rate: 0, avg_sell_rate: 0, count: 0, last_update_at: '' }, parallel_market: { avg_buy_rate: 0, avg_sell_rate: 0, count: 0, last_update_at: '' } },
        meta: { message: 'No data found' },
      };
    }
    throw new Error('Failed to fetch currency averages');
  }

  return await response.json();
}

/**
 * Get all bank rates for a currency with charts
 * GET /api/currency/banks?from_currency=USD&to_currency=EGP&period=24h
 *
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code (default: EGP)
 * @param period - Time period for chart data (default: 24h)
 */
export async function fetchCurrencyBanks(
  fromCurrency: string,
  toCurrency: string = 'EGP',
  period: '24h' | '7d' | '30d' = '24h'
): Promise<CurrencyBanksResponse> {
  const params = new URLSearchParams({
    from_currency: fromCurrency,
    to_currency: toCurrency,
    period: period,
  });

  const response = await fetch(`${API_BASE_URL}/currency/banks?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        status: 404, success: false,
        data: { from_currency: fromCurrency, to_currency: toCurrency, period, banks: [] },
        meta: { message: 'No data found' },
      };
    }
    throw new Error('Failed to fetch bank rates');
  }

  return await response.json();
}

/**
 * Get black market (parallel market) currency rates
 * GET /api/currency/black-market?currency=USD&to_currency=EGP
 *
 * @param currency - Optional currency code filter (e.g., USD, EUR)
 * @param toCurrency - Target currency code (default: EGP)
 */
export async function fetchBlackMarketRates(
  currency?: string,
  toCurrency: string = 'EGP'
): Promise<BlackMarketResponse> {
  const params = new URLSearchParams({ to_currency: toCurrency });
  if (currency) {
    params.set('currency', currency);
  }

  const response = await fetch(`${API_BASE_URL}/currency/black-market?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        status: 404, success: false,
        data: { source: 'black_market', source_english_name: 'Black Market', source_arabic_name: 'السوق السوداء', to_currency: toCurrency, last_update_at: '', rates: [] },
        meta: { message: 'No data found' },
      };
    }
    throw new Error('Failed to fetch black market rates');
  }

  return await response.json();
}

// =============================================================================
// CATEGORY API FUNCTIONS
// =============================================================================

/**
 * Fetch child categories for a given parent node
 * GET /api/category/child-categories?parent_node_name=news
 *
 * @param parentNodeName - The parent node name (e.g., 'news')
 */
export async function fetchChildCategories(
  parentNodeName: string
): Promise<ApiCategoryItem[]> {
  const params = new URLSearchParams({ parent_node_name: parentNodeName });

  const response = await fetch(`${API_BASE_URL}/category/child-categories?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const payload: unknown = await response.json();
  if (Array.isArray(payload)) return payload as ApiCategoryItem[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: ApiCategoryItem[] }).data;
  }
  return [];
}

/**
 * Fetch news categories
 * Shorthand for fetchChildCategories('news')
 */
export async function fetchNewsCategories(): Promise<ApiCategoryItem[]> {
  return fetchChildCategories('news');
}

// =============================================================================
// NEWS API FUNCTIONS
// =============================================================================

/**
 * Fetch paginated news list from API
 * GET /api/news/articles
 *
 * @param category - Filter by category (optional - frontend filtering by category slug)
 * @param page - Page number (default: 1)
 * @param search - Search query (optional)
 * @param limit - Items per page (default: 12)
 * @param sourceName - Unused, kept for API compatibility
 * @param sortBy - Sort order: 'latest' | 'oldest' (default: 'latest')
 */
export async function fetchNewsList(
  category?: NewsCategory,
  page: number = 1,
  search?: string,
  limit: number = NEWS_PER_PAGE,
  sourceName?: string,
  sortBy: 'latest' | 'oldest' = 'latest'
): Promise<NewsListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    sort_by: sortBy,
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`${API_BASE_URL}/news/articles?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch news list');
  }

  const apiResponse: ApiNewsListResponse & { meta?: { pagination?: { current_page?: number; per_page?: number; total?: number; last_page?: number } } } = await response.json();

  // Transform API response to frontend format
  let newsItems = apiResponse.data.map(adaptApiNewsToNewsItem);

  // Apply category filter on frontend if specified
  if (category) {
    newsItems = newsItems.filter(item => item.category === category);
  }

  // Adapt pagination
  const legacyPagination = apiResponse.meta?.pagination;
  const pagination = apiResponse.pagination
    ? adaptApiPagination(apiResponse.pagination)
    : {
        currentPage: legacyPagination?.current_page ?? page,
        totalPages: legacyPagination?.last_page ?? 1,
        totalItems: legacyPagination?.total ?? newsItems.length,
        perPage: legacyPagination?.per_page ?? limit,
        hasNextPage: (legacyPagination?.current_page ?? page) < (legacyPagination?.last_page ?? 1),
        hasPreviousPage: (legacyPagination?.current_page ?? page) > 1,
      };

  return {
    status: apiResponse.status,
    success: apiResponse.success,
    data: {
      news: newsItems,
      pagination,
      filters: {
        category,
        search,
      },
    },
    meta: {
      message: 'News fetched successfully',
    },
  };
}

/**
 * Fetch single news article by ID
 * GET /api/news/articles/:news_id
 *
 * @param newsId - News article numeric ID
 */
export async function fetchNewsDetail(newsId: string): Promise<NewsDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/news/articles/${newsId}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('News article not found');
    }
    throw new Error('Failed to fetch news detail');
  }

  const apiResponse: ApiNewsDetailResponse = await response.json();

  // Transform API response to frontend format
  const news = adaptApiNewsToNewsItem(apiResponse.data);

  // Fetch related news
  let relatedNews: typeof news[] = [];
  try {
    const relatedResponse = await fetch(`${API_BASE_URL}/news/${newsId}/get-related-newss`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ar',
      },
    });
    if (relatedResponse.ok) {
      const relatedData: ApiRelatedNewsResponse = await relatedResponse.json();
      if (relatedData.data && Array.isArray(relatedData.data)) {
        relatedNews = relatedData.data.map(adaptApiNewsToNewsItem);
      }
    }
  } catch {
    // Silently fail - related news is optional
  }

  return {
    status: apiResponse.status,
    success: apiResponse.success,
    data: {
      news,
      relatedNews,
    },
    meta: {
      message: 'News detail fetched successfully',
    },
  };
}

/**
 * Fetch featured/breaking news
 * GET /api/news/articles?sort_by=latest
 */
export async function fetchFeaturedNews(): Promise<NewsFeaturedResponse> {
  const params = new URLSearchParams({
    page: '1',
    sort_by: 'latest',
  });

  const response = await fetch(`${API_BASE_URL}/news/articles?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch featured news');
  }

  const apiResponse: ApiNewsListResponse = await response.json();

  // Transform API response to frontend format
  const newsItems = apiResponse.data.map(adaptApiNewsToNewsItem);

  // Mark first 6 as featured, first 1 as breaking
  const featured = newsItems.slice(0, 6).map(item => ({
    ...item,
    isFeatured: true,
  }));

  const breaking = newsItems.slice(0, 1).map(item => ({
    ...item,
    isBreaking: true,
  }));

  return {
    status: apiResponse.status,
    success: apiResponse.success,
    data: {
      featured,
      breaking,
    },
    meta: {
      message: 'Featured news fetched successfully',
    },
  };
}

// =============================================================================
// CRYPTO API FUNCTIONS
// =============================================================================

/**
 * Fetch paginated cryptocurrency list
 * GET /api/crypto?per_page=20&page=1
 *
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 20)
 */
export async function fetchCryptoList(
  page: number = 1,
  perPage: number = 20
): Promise<CryptoListApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/crypto?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        status: 404, success: false, data: [],
        meta: { message: 'No data found', pagination: { total: 0, count: 0, per_page: perPage, current_page: page, total_pages: 0 } },
      };
    }
    throw new Error('Failed to fetch crypto prices');
  }

  return await response.json();
}

/**
 * Fetch top 3 cryptocurrencies summary
 * GET /api/crypto/top
 */
export async function fetchCryptoTop(): Promise<CryptoTopApiResponse> {
  const response = await fetch(`${API_BASE_URL}/crypto/top`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { status: 404, success: false, data: [], meta: { message: 'No data found' } };
    }
    throw new Error('Failed to fetch top cryptos');
  }

  return await response.json();
}

// =============================================================================
// SILVER API FUNCTIONS
// =============================================================================

/**
 * Fetch silver overview (home page data)
 * GET /api/silver/get-overview
 *
 * Returns prices for silver products:
 * - 999 Swiss, 999 Egyptian, 925, 800, Ounce (USD)
 */
export async function fetchSilverOverview(): Promise<SilverOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/silver/get-overview`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch silver overview');
  }

  return await response.json();
}

/**
 * Fetch all silver prices with optional filters
 * GET /api/silver/get-all-prices
 *
 * @param currency - Currency code (default: "EGP")
 * @param period - Time period: "24h" | "7d" | "30d" (default: "30d")
 */
export async function fetchAllSilverPrices(
  currency: string = 'EGP',
  period: '24h' | '7d' | '30d' = '30d'
): Promise<SilverAllPricesResponse> {
  const params = new URLSearchParams({
    currency,
    period,
  });

  const response = await fetch(`${API_BASE_URL}/silver/get-all-prices?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'ar',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch all silver prices');
  }

  return await response.json();
}
