'use client';

import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { NewsCard } from './news-card';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelatedNewsProps {
  news: NewsItem[];
  className?: string;
}

export function RelatedNews({ news, className }: RelatedNewsProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (news.length === 0) {
    return null;
  }

  return (
    <section className={cn('space-y-4', className)}>
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {isRTL ? 'أخبار ذات صلة' : 'Related News'}
        </h2>
      </div>

      {/* Related news grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.slice(0, 3).map((item) => (
          <NewsCard key={item.id} news={item} variant="default" />
        ))}
      </div>
    </section>
  );
}
