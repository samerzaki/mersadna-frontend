import { NewsCategoryInfo } from '@/types/news';

/**
 * Color palette for dynamically assigned category colors.
 * Categories from the API are assigned colors based on their order.
 */
export const CATEGORY_COLORS: { color: string; darkColor: string }[] = [
  {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    darkColor: 'dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  },
  {
    color: 'bg-primary-100 text-primary-800 border-primary-200',
    darkColor: 'dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800',
  },
  {
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    darkColor: 'dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600',
  },
  {
    color: 'bg-green-100 text-green-800 border-green-200',
    darkColor: 'dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  },
  {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    darkColor: 'dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  },
  {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    darkColor: 'dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  },
  {
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    darkColor: 'dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
  },
  {
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    darkColor: 'dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800',
  },
];

const DEFAULT_COLORS = {
  color: 'bg-gray-100 text-gray-800 border-gray-200',
  darkColor: 'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
};

/**
 * Get category info from a categories array
 */
export function getCategoryInfo(
  categorySlug: string,
  categories: NewsCategoryInfo[]
): NewsCategoryInfo | undefined {
  return categories.find((cat) => cat.id === categorySlug || cat.slug === categorySlug);
}

/**
 * Get category color classes from a categories array
 */
export function getCategoryColors(
  categorySlug: string,
  categories: NewsCategoryInfo[]
): string {
  const category = getCategoryInfo(categorySlug, categories);
  if (!category) return `${DEFAULT_COLORS.color} ${DEFAULT_COLORS.darkColor}`;
  return `${category.color} ${category.darkColor}`;
}

/**
 * LocalStorage key for bookmarked news
 */
export const BOOKMARKS_STORAGE_KEY = 'odamak_news_bookmarks';

/**
 * News refresh interval (5 minutes for news, less frequent than prices)
 */
export const NEWS_REFRESH_INTERVAL = 300000; // 5 minutes

/**
 * News stale time (2 minutes)
 */
export const NEWS_STALE_TIME = 120000; // 2 minutes

/**
 * Default items per page
 */
export const NEWS_PER_PAGE = 12;
