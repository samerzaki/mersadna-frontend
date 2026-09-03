'use client';

import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { newsDetailPath } from '@/lib/news-routes';
import { NewsImage } from '@/components/ui/news-image';
import type { NewsItem } from '@/types';

interface HotNewsSectionClientProps {
  news: NewsItem[];
  /** Server timestamp used to keep relative dates stable during hydration. */
  referenceTime: string;
}

export function HotNewsSectionClient({ news, referenceTime }: HotNewsSectionClientProps) {
  const { language, t } = useLanguage();
  // This streamed boundary can hydrate after the language provider restores a
  // saved client preference. Begin with the server's Arabic default, then
  // switch languages only after hydration has completed.
  const [displayLanguage, setDisplayLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    setDisplayLanguage(language);
  }, [language]);

  const isRTL = displayLanguage === 'ar';

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-5">
        <Link href="/news" className="group">
          <h2 className="font-heading text-[22px] md:text-[25px] font-semibold text-text transition-colors group-hover:text-gold">
            {t.home2026.economyNews}
          </h2>
        </Link>
        <Link href="/news" className="text-[13px] text-gold hover:opacity-75 transition-opacity shrink-0">
          {t.home2026.newsCenter}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {news.map((item) => {
          const title = isRTL ? item.titleAr : item.title;
          const tag = item.tags?.[0] || item.source?.nameAr || item.source?.name;
          const timeAgo = formatDistance(new Date(item.publishedAt), new Date(referenceTime), {
            addSuffix: true,
            locale: isRTL ? ar : enUS,
          });

          return (
            <Link
              key={item.id}
              href={newsDetailPath(item.id, item.slug, item.title)}
              className="card-surface overflow-hidden group hover:shadow-gold transition-shadow"
            >
              <NewsImage src={item.thumbnail} alt={title} className="h-[150px] w-full" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-[11px]">
                  {tag && <span className="text-gold font-semibold">{tag}</span>}
                  {tag && <span className="text-dim">·</span>}
                  <span className="text-dim">{timeAgo}</span>
                </div>
                <h3 className="font-heading text-[15.5px] leading-[1.6] text-text line-clamp-2 group-hover:text-gold transition-colors">
                  {title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
