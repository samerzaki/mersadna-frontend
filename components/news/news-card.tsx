'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { useNewsCategories } from '@/hooks/use-news';
import { getCategoryColors, getCategoryInfo } from '@/lib/news-constants';
import { cn } from '@/lib/utils';
import { BookmarkButton } from './bookmark-button';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'compact' | 'featured';
  showBookmark?: boolean;
}

export function NewsCard({ news, variant = 'default', showBookmark = true }: NewsCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { categories } = useNewsCategories();
  const categoryInfo = getCategoryInfo(news.category, categories);

  const title = isRTL ? news.titleAr : news.title;
  const excerpt = isRTL ? news.excerptAr : news.excerpt;
  const categoryName = categoryInfo ? (isRTL ? categoryInfo.nameAr : categoryInfo.nameEn) : news.category;

  const timeAgo = formatDistanceToNow(new Date(news.publishedAt), {
    addSuffix: true,
    locale: isRTL ? ar : enUS,
  });

  if (variant === 'compact') {
    return (
      <Link
        href={`/news/${news.id}`}
        className="group flex gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all"
      >
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={news.thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn('inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1', getCategoryColors(news.category, categories))}>
            {categoryName}
          </span>
          <h3 className="font-bold text-sm line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/news/${news.id}`}
        className="group relative block rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all"
      >
        <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
          <Image
            src={news.thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 start-4 flex items-center gap-2">
            {news.isBreaking && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
                <Zap className="w-3 h-3" />
                {isRTL ? 'عاجل' : 'Breaking'}
              </span>
            )}
            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getCategoryColors(news.category, categories))}>
              {categoryName}
            </span>
          </div>

          {/* Bookmark */}
          {showBookmark && (
            <div className="absolute top-4 end-4" onClick={(e) => e.preventDefault()}>
              <BookmarkButton news={news} variant="icon" />
            </div>
          )}

          {/* Content overlay */}
          <div className="absolute bottom-0 start-0 end-0 p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-2 mb-2 group-hover:text-primary-300 transition-colors">
              {title}
            </h2>
            <p className="text-sm text-slate-200 line-clamp-2 mb-3">{excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {news.readingTimeMinutes} {isRTL ? 'دقائق' : 'min'}
              </span>
              <span>{timeAgo}</span>
              {news.viewCount && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {news.viewCount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/news/${news.id}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
    >
      <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
        <Image
          src={news.thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex items-center gap-2">
          {news.isBreaking && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
              <Zap className="w-3 h-3" />
            </span>
          )}
          <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', getCategoryColors(news.category, categories))}>
            {categoryName}
          </span>
        </div>

        {/* Bookmark */}
        {showBookmark && (
          <div className="absolute top-3 end-3" onClick={(e) => e.preventDefault()}>
            <BookmarkButton news={news} variant="icon" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{excerpt}</p>

        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {news.readingTimeMinutes} {isRTL ? 'د' : 'm'}
            </span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
