// News API adapters - Transform API responses to frontend format

import type {
  ApiNewsItem,
  NewsItem,
  NewsCategory,
  NewsPagination,
  ApiNewsPagination,
} from '@/types';

/**
 * Extract excerpt from HTML content or description
 * Takes first 200 characters and strips HTML tags
 */
function extractExcerpt(text: string, maxLength: number = 200): string {
  // Remove HTML tags
  const clean = text.replace(/<[^>]*>/g, '');
  // Trim and truncate
  return clean.length > maxLength ? clean.substring(0, maxLength) + '...' : clean;
}

/**
 * Estimate reading time from content length
 * Assumes average reading speed of 200 words per minute (Arabic)
 */
function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * Map API category slug to frontend NewsCategory
 * Now passes through the slug directly since categories are dynamic
 */
function mapCategorySlug(slug: string): NewsCategory {
  return slug || 'uncategorized';
}

/**
 * Transform API news item to frontend NewsItem format
 */
export function adaptApiNewsToNewsItem(apiNews: ApiNewsItem): NewsItem {
  const id = apiNews.id.toString();
  const content = apiNews.content || '';
  const excerpt = apiNews.description || extractExcerpt(content || apiNews.title);
  const category = mapCategorySlug(apiNews.category?.slug || 'economy');
  const readingTime = content ? estimateReadingTime(content) : 3;

  return {
    id,
    slug: id,
    title: apiNews.title,
    titleAr: apiNews.title,
    excerpt,
    excerptAr: excerpt,
    content,
    contentAr: content,
    category,
    tags: [category],
    thumbnail: apiNews.image_url,
    source: {
      id: 'nezzel',
      name: 'Nezzel',
      nameAr: 'نِزِل',
    },
    publishedAt: apiNews.published_at,
    readingTimeMinutes: readingTime,
    isFeatured: false,
    isBreaking: false,
  };
}

/**
 * Transform API pagination to frontend pagination format
 */
export function adaptApiPagination(pagination: ApiNewsPagination): NewsPagination {
  return {
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.total,
    perPage: pagination.perPage,
    hasNextPage: pagination.currentPage < pagination.totalPages,
    hasPreviousPage: pagination.currentPage > 1,
  };
}
