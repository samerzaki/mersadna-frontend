'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Newspaper, Zap, Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { newsDetailPath } from '@/lib/news-routes';
import type { NewsItem } from '@/types';

interface HotNewsSectionClientProps {
  news: NewsItem[];
  /** Server timestamp used to keep relative dates stable during hydration. */
  referenceTime: string;
}

export function HotNewsSectionClient({ news, referenceTime }: HotNewsSectionClientProps) {
  const { language } = useLanguage();
  // This streamed boundary can hydrate after the language provider restores a
  // saved client preference. Begin with the server's Arabic default, then
  // switch languages only after hydration has completed.
  const [displayLanguage, setDisplayLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    setDisplayLanguage(language);
  }, [language]);

  const isRTL = displayLanguage === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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

      </div>

      {/* News Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {news.map((item) => {
          const title = isRTL ? item.titleAr : item.title;

          const timeAgo = formatDistance(new Date(item.publishedAt), new Date(referenceTime), {
            addSuffix: true,
            locale: isRTL ? ar : enUS,
          });

          return (
            <Link
              key={item.id}
              href={newsDetailPath(item.id, item.slug, item.title)}
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
