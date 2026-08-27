'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Zap } from 'lucide-react';
import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { useNewsCategories } from '@/hooks/use-news';
import { getCategoryColors, getCategoryInfo } from '@/lib/news-constants';
import { cn } from '@/lib/utils';

interface FeaturedNewsProps {
  featured: NewsItem[];
  breaking: NewsItem[];
  className?: string;
}

function OverlayCard({ news, className, titleClass }: { news: NewsItem; className?: string; titleClass?: string }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { categories } = useNewsCategories();
  const categoryInfo = getCategoryInfo(news.category, categories);
  const title = isRTL ? news.titleAr : news.title;
  const categoryName = categoryInfo ? (isRTL ? categoryInfo.nameAr : categoryInfo.nameEn) : news.category;

  return (
    <Link
      href={`/news/${news.id}`}
      className={cn(
        'group relative block rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800',
        className
      )}
    >
      <Image
        src={news.thumbnail}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Category badge */}
      <div className="absolute top-3 start-3 flex items-center gap-2">
        {news.isBreaking && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
            <Zap className="w-3 h-3" />
          </span>
        )}
        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getCategoryColors(news.category, categories))}>
          {categoryName}
        </span>
      </div>

      {/* Title overlay */}
      <div className="absolute bottom-0 start-0 end-0 p-4">
        <h3 className={cn(
          'font-bold text-white line-clamp-2 group-hover:text-primary-300 transition-colors',
          titleClass || 'text-sm'
        )}>
          {title}
        </h3>
      </div>
    </Link>
  );
}

export function FeaturedNews({ featured, breaking, className }: FeaturedNewsProps) {
  const topNews = [...breaking, ...featured.filter((f) => !breaking.some((b) => b.id === f.id))];

  if (topNews.length === 0) {
    return null;
  }

  // 1 big + 5 surrounding
  const mainNews = topNews[0];
  const surrounding = topNews.slice(1, 6);

  return (
    <section className={cn(className)}>
      {/*
        Bento grid layout (RTL):
        ┌────────┬────────────────┬────────┐
        │ side1  │                │ side2  │
        ├────────┤   BIG (main)   ├────────┤
        │ side3  │                │ side4  │
        ├────────┴────────────────┴────────┤
        │            bottom                │
        └──────────────────────────────────┘
      */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-[200px_200px] gap-3">
        {/* Main featured - right side in RTL, spans 2 cols & 2 rows */}
        <div className="lg:col-span-2 lg:row-span-2">
          <OverlayCard
            news={mainNews}
            className="relative aspect-video lg:aspect-auto lg:h-full"
            titleClass="text-xl md:text-2xl"
          />
        </div>

        {/* Side 1 */}
        {surrounding[0] && (
          <OverlayCard
            news={surrounding[0]}
            className="relative aspect-video lg:aspect-auto lg:h-full"
          />
        )}

        {/* Side 2 */}
        {surrounding[1] && (
          <OverlayCard
            news={surrounding[1]}
            className="relative aspect-video lg:aspect-auto lg:h-full"
          />
        )}

        {/* Side 3 */}
        {surrounding[2] && (
          <OverlayCard
            news={surrounding[2]}
            className="relative aspect-video lg:aspect-auto lg:h-full"
          />
        )}

        {/* Side 4 */}
        {surrounding[3] && (
          <OverlayCard
            news={surrounding[3]}
            className="relative aspect-video lg:aspect-auto lg:h-full"
          />
        )}
      </div>

    </section>
  );
}
