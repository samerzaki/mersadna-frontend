'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Newspaper, Zap, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/language-context';
import { useNewsCategories } from '@/hooks/use-news';
import { getCategoryColors, getCategoryInfo } from '@/lib/news-constants';
import { cn } from '@/lib/utils';
import type { NewsItem } from '@/types';

interface HotNewsSectionClientProps {
  news: NewsItem[];
}

export function HotNewsSectionClient({ news }: HotNewsSectionClientProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const { categories } = useNewsCategories();

  return (
    <section>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Link
          href="/news"
          className="group"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">

            <Newspaper className="w-6 h-6 text-primary-600" />
            {isRTL ? 'آخر الأخبار' : 'Latest News'}

          </h2>
        </Link>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Link
            href="/news"
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {isRTL ? 'الكل' : 'All'}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/news?category=${category.slug}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isRTL ? category.nameAr : category.nameEn}
            </Link>
          ))}
        </div>
      </div>

      {/* News Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {news.map((item) => {
          const categoryInfo = getCategoryInfo(item.category, categories);
          const title = isRTL ? item.titleAr : item.title;
          const categoryName = categoryInfo
            ? isRTL ? categoryInfo.nameAr : categoryInfo.nameEn
            : item.category;

          const timeAgo = formatDistanceToNow(new Date(item.publishedAt), {
            addSuffix: true,
            locale: isRTL ? ar : enUS,
          });

          return (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group block rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
                <Image
                  src={item.thumbnail}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />

                {/* Badges */}
                <div className="absolute top-2 start-2 flex items-center gap-1">
                  {item.isBreaking && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-full animate-pulse">
                      <Zap className="w-2.5 h-2.5" />
                    </span>
                  )}
                  <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full', getCategoryColors(item.category, categories))}>
                    {categoryName}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Link */}
      <Link
        href="/news"
        className="flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <span>{isRTL ? 'عرض كل الأخبار' : 'View All News'}</span>
        <ArrowIcon className="h-4 w-4" />
      </Link>
    </section>
  );
}
