'use client';

import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { NewsCard } from './news-card';
import { NewsListSkeleton } from './news-card-skeleton';
import { FileX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsListProps {
  news: NewsItem[];
  isLoading?: boolean;
  variant?: 'default' | 'compact';
  showBookmark?: boolean;
  columns?: 1 | 2 | 3;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
}

export function NewsList({
  news,
  isLoading = false,
  variant = 'default',
  showBookmark = true,
  columns = 3,
  emptyMessage,
  emptyDescription,
  className,
}: NewsListProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-4',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'grid-cols-1 md:grid-cols-2',
          columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          className
        )}
      >
        <NewsListSkeleton count={columns === 1 ? 4 : 6} variant={variant} />
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-panel2 flex items-center justify-center mb-4">
          <FileX className="w-8 h-8 text-dim" />
        </div>
        <h3 className="font-heading text-[16px] font-semibold text-text mb-2">
          {emptyMessage || (isRTL ? 'لا توجد أخبار' : 'No news found')}
        </h3>
        <p className="text-[13px] text-muted max-w-sm">
          {emptyDescription || (isRTL ? 'جرب تغيير معايير البحث أو الفلترة' : 'Try changing your search or filter criteria')}
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-3', className)}>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} variant="compact" showBookmark={showBookmark} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {news.map((item) => (
        <NewsCard key={item.id} news={item} variant="default" showBookmark={showBookmark} />
      ))}
    </div>
  );
}
