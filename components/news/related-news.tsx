'use client';

import { NewsItem } from '@/types';
import { NewsCard } from './news-card';
import { cn } from '@/lib/utils';

interface RelatedNewsProps {
  news: NewsItem[];
  max?: number;
  className?: string;
}

export function RelatedNews({ news, max = 4, className }: RelatedNewsProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <div className={cn('divide-y divide-line2', className)}>
      {news.slice(0, max).map((item) => (
        <NewsCard key={item.id} news={item} variant="compact" showBookmark={false} />
      ))}
    </div>
  );
}
