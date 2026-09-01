'use client';

import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { useNewsList, useFeaturedNews } from '@/hooks/use-news';
import { useLanguage } from '@/contexts/language-context';
import {
  NewsSearch,
  NewsList,
  FeaturedNews,
} from '@/components/news';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/components/ui/api-error';

export default function NewsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Fetch featured news (only on first page with no filters)
  const {
    data: featuredData,
    isLoading: featuredLoading,
  } = useFeaturedNews();

  // Fetch news list
  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
    refetch,
  } = useNewsList(search, page);

  const showFeatured = !search && page === 1;
  const allNews = newsData?.data.news || [];
  const pagination = newsData?.data.pagination;

  // Exclude featured news IDs from the list to avoid duplication
  const featuredIds = showFeatured && featuredData?.data
    ? new Set([
        ...featuredData.data.featured.map((n) => n.id),
        ...featuredData.data.breaking.map((n) => n.id),
      ])
    : null;

  const news = featuredIds
    ? allNews.filter((item) => !featuredIds.has(item.id))
    : allNews;

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to page 1 when search changes
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isRTL ? 'آخر الأخبار' : 'Latest News'}
            </h1>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-6">
        <NewsSearch
          value={search}
          onChange={handleSearchChange}
          className="max-w-md"
        />
      </div>

      {/* Featured News Section */}
      {showFeatured && !featuredLoading && featuredData?.data && (
        <div className="mb-8">
          <FeaturedNews
            featured={featuredData.data.featured}
            breaking={featuredData.data.breaking}
          />
        </div>
      )}

      {/* Error State */}
      {newsError && (
        <ApiError
          error={newsError}
          retry={refetch}
        />
      )}

      {/* News List */}
      {!newsError && (
        <>
          <NewsList
            news={news}
            isLoading={newsLoading}
            showBookmark={true}
            columns={3}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPreviousPage}
              >
                {isRTL ? 'السابق' : 'Previous'}
              </Button>
              <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                {isRTL
                  ? `صفحة ${pagination.currentPage} من ${pagination.totalPages}`
                  : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
              >
                {isRTL ? 'التالي' : 'Next'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
