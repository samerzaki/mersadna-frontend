// News-related type definitions

/**
 * News category slug (dynamic from API)
 */
export type NewsCategory = string;

/**
 * News category from API (child-categories endpoint)
 */
export interface ApiCategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  web_image_url: string | null;
  mobile_image_url: string | null;
  children: ApiCategoryItem[];
  icon_img_url: string | null;
}

/**
 * News category metadata for UI display
 */
export interface NewsCategoryInfo {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  color: string;
  darkColor: string;
}

/**
 * News source information
 */
export interface NewsSource {
  id: string;
  name: string;
  nameAr: string;
  logo?: string;
  url?: string;
}

/**
 * Individual news article
 */
export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  category: NewsCategory;
  tags: string[];
  thumbnail: string;
  thumbnailAlt?: string;
  source: NewsSource;
  author?: string;
  authorAr?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount?: number;
  relatedNewsIds?: string[];
}

/**
 * Pagination info
 */
export interface NewsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated news list response
 */
export interface NewsListResponse {
  status: number;
  success: boolean;
  data: {
    news: NewsItem[];
    pagination: NewsPagination;
    filters: {
      category?: NewsCategory;
      search?: string;
    };
  };
  meta: {
    message: string;
  };
}

/**
 * Single news article detail response
 */
export interface NewsDetailResponse {
  status: number;
  success: boolean;
  data: {
    news: NewsItem;
    relatedNews: NewsItem[];
  };
  meta: {
    message: string;
  };
}

/**
 * Featured news response
 */
export interface NewsFeaturedResponse {
  status: number;
  success: boolean;
  data: {
    featured: NewsItem[];
    breaking: NewsItem[];
  };
  meta: {
    message: string;
  };
}

/**
 * Bookmarked news item (for localStorage)
 */
export interface BookmarkedNews {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  thumbnail: string;
  category: NewsCategory;
  excerpt: string;
  excerptAr: string;
  bookmarkedAt: string;
}

// =============================================================================
// API TYPES FOR NEWS ARTICLES
// =============================================================================

/**
 * Category object from API
 */
export interface ApiNewsCategory {
  id: number;
  name: string;
  slug: string;
}

/**
 * News article item from API (raw format)
 */
export interface ApiNewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  is_rewritten: boolean;
  published_at: string;
  created_at: string;
  date: string;
  date_human: string;
  date_formatted: string;
  category: ApiNewsCategory;
  // Detail-only fields
  content?: string;
  key_points?: string[];
  original_title?: string;
  original_content?: string;
}

/**
 * API pagination format
 */
export interface ApiNewsPagination {
  count: number;
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

/**
 * News articles list API response
 */
export interface ApiNewsListResponse {
  status: number;
  success: boolean;
  data: ApiNewsItem[];
  pagination: ApiNewsPagination;
}

/**
 * News article detail API response
 */
export interface ApiNewsDetailResponse {
  status: number;
  success: boolean;
  data: ApiNewsItem;
}

/**
 * Related news API response
 */
export interface ApiRelatedNewsResponse {
  status: number;
  success: boolean;
  data: ApiNewsItem[];
}
