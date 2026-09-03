'use client';

import { useState } from 'react';
import { useNewsList, useFeaturedNews } from '@/hooks/use-news';
import { useLanguage } from '@/contexts/language-context';
import {
  NewsSearch,
  NewsList,
  FeaturedNews,
} from '@/components/news';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/components/ui/api-error';

export default function NewsPage() {
  const { t, language } = useLanguage();
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
    <div>
      <PageHeader title={t.pages.news.title} lead={t.pages.news.subtitle} />

      {/* Search (no category taxonomy in the API — search takes the pills slot) */}
      <div className="flex justify-end mb-6">
        <NewsSearch
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-sm"
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
              <span className="num px-4 py-2 text-[13px] text-muted">
                {pagination.currentPage} / {pagination.totalPages}
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
