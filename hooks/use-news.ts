// React Query hooks for News API

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchNewsList, fetchNewsDetail, fetchFeaturedNews, fetchNewsCategories } from '@/lib/api';
import { NewsCategory, BookmarkedNews, NewsItem, NewsCategoryInfo } from '@/types';
import { NEWS_REFRESH_INTERVAL, NEWS_STALE_TIME, BOOKMARKS_STORAGE_KEY, CATEGORY_COLORS } from '@/lib/news-constants';
import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Fetch paginated news list with filters
 */
export function useNewsList(
  category?: NewsCategory,
  search?: string,
  page: number = 1
) {
  return useQuery({
    queryKey: ['news', 'list', category, search, page],
    queryFn: () => fetchNewsList(category, page, search),
    staleTime: NEWS_STALE_TIME,
    gcTime: NEWS_REFRESH_INTERVAL,
  });
}

/**
 * Infinite scroll news list
 */
export function useInfiniteNewsList(
  category?: NewsCategory,
  search?: string
) {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite', category, search],
    queryFn: ({ pageParam = 1 }) => fetchNewsList(category, pageParam, search),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNextPage) {
        return lastPage.data.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: NEWS_STALE_TIME,
  });
}

/**
 * Fetch single news article by slug
 */
export function useNewsDetail(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['news', 'detail', slug],
    queryFn: () => fetchNewsDetail(slug),
    enabled: enabled && !!slug,
    staleTime: NEWS_STALE_TIME * 2, // 4 minutes for detail pages
  });
}

/**
 * Fetch featured/breaking news
 */
export function useFeaturedNews() {
  return useQuery({
    queryKey: ['news', 'featured'],
    queryFn: fetchFeaturedNews,
    staleTime: NEWS_STALE_TIME,
    refetchInterval: NEWS_REFRESH_INTERVAL,
  });
}

/**
 * Fetch news categories from API
 * GET /api/category/child-categories?parent_node_name=news
 */
export function useNewsCategories() {
  const query = useQuery({
    queryKey: ['categories', 'news'],
    queryFn: fetchNewsCategories,
    staleTime: 600000, // 10 minutes - categories rarely change
    gcTime: 1800000,   // 30 minutes
  });

  // Transform API categories to NewsCategoryInfo for UI
  const categories: NewsCategoryInfo[] = useMemo(() => {
    if (!query.data) return [];
    return query.data.map((cat, index) => {
      const colors = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
      return {
        id: cat.slug,
        nameEn: cat.name,
        nameAr: cat.name, // API returns name in Accept-Language
        slug: cat.slug,
        color: colors.color,
        darkColor: colors.darkColor,
      };
    });
  }, [query.data]);

  return {
    ...query,
    categories,
  };
}

/**
 * Manage bookmarked news (localStorage)
 */
export function useNewsBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedNews[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        try {
          setBookmarks(JSON.parse(stored));
        } catch {
          setBookmarks([]);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = useCallback((news: NewsItem | BookmarkedNews) => {
    const bookmarkedNews: BookmarkedNews = {
      id: news.id,
      slug: news.slug,
      title: news.title,
      titleAr: news.titleAr,
      thumbnail: news.thumbnail,
      category: news.category,
      excerpt: 'excerpt' in news ? news.excerpt : '',
      excerptAr: 'excerptAr' in news ? news.excerptAr : '',
      bookmarkedAt: new Date().toISOString(),
    };

    setBookmarks((prev) => {
      if (prev.some((b) => b.id === news.id)) {
        return prev; // Already bookmarked
      }
      return [bookmarkedNews, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((newsId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== newsId));
  }, []);

  const isBookmarked = useCallback(
    (newsId: string) => bookmarks.some((b) => b.id === newsId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (news: NewsItem | BookmarkedNews) => {
      if (isBookmarked(news.id)) {
        removeBookmark(news.id);
      } else {
        addBookmark(news);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  const bookmarkCount = useMemo(() => bookmarks.length, [bookmarks]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    bookmarkCount,
    isLoaded,
  };
}
