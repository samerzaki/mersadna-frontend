'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { newsDetailPath } from '@/lib/news-routes';
import { formatRelativeTime } from '@/lib/format';
import { NewsImage } from '@/components/ui/news-image';
import { BookmarkButton } from './bookmark-button';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'compact' | 'featured';
  showBookmark?: boolean;
}

export function NewsCard({ news, variant = 'default', showBookmark = true }: NewsCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const title = isRTL ? news.titleAr : news.title;
  const excerpt = isRTL ? news.excerptAr : news.excerpt;
  const tag = news.isBreaking ? (isRTL ? 'عاجل' : 'Breaking') : (isRTL ? news.source.nameAr : news.source.name);

  const timeAgo = formatRelativeTime(news.publishedAt, language);

  if (variant === 'compact') {
    return (
      <Link
        href={newsDetailPath(news.id, news.slug, news.title)}
        className="group flex gap-3 p-2.5 rounded-xl hover:bg-hover transition-colors"
      >
        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
          <NewsImage src={news.thumbnail} alt={title} className="w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-[13px] font-semibold line-clamp-2 text-text group-hover:text-gold transition-colors">
            {title}
          </h3>
          <p className="num text-[11px] text-dim mt-1">{timeAgo}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={newsDetailPath(news.id, news.slug, news.title)}
        className="group relative block card-surface overflow-hidden"
      >
        <div className="relative aspect-[16/9]">
          <NewsImage src={news.thumbnail} alt={title} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-4 start-4 flex items-center gap-2">
            {news.isBreaking && (
              <span className="chip bg-down text-on-gold inline-flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {isRTL ? 'عاجل' : 'Breaking'}
              </span>
            )}
          </div>

          {showBookmark && (
            <div className="absolute top-4 end-4" onClick={(e) => e.preventDefault()}>
              <BookmarkButton news={news} variant="icon" />
            </div>
          )}

          <div className="absolute bottom-0 start-0 end-0 p-6">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-white line-clamp-2 mb-2">
              {title}
            </h2>
            <p className="text-[13px] text-white/80 line-clamp-2">{excerpt}</p>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant: 200px thumbnail, tag + time row, 14px Kufi title
  return (
    <Link
      href={newsDetailPath(news.id, news.slug, news.title)}
      className="group block card-surface overflow-hidden"
    >
      <div className="relative h-[200px]">
        <NewsImage src={news.thumbnail} alt={title} className="w-full h-full" />
        {showBookmark && (
          <div
            className="absolute top-2 end-2"
            onClick={(e) => e.preventDefault()}
          >
            <BookmarkButton news={news} variant="icon" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={cn('chip', news.isBreaking && 'bg-down-soft text-down')}>{tag}</span>
          <span className="num text-[11px] text-dim">{timeAgo}</span>
        </div>
        <h3 className="font-heading text-[14px] font-semibold text-text line-clamp-2 leading-snug group-hover:text-gold transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
