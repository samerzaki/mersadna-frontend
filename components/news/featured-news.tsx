'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { newsDetailPath } from '@/lib/news-routes';
import { formatRelativeTime } from '@/lib/format';
import { NewsImage } from '@/components/ui/news-image';
import { SectionCard } from '@/components/ui/section-card';
import { cn } from '@/lib/utils';

interface FeaturedNewsProps {
  featured: NewsItem[];
  breaking: NewsItem[];
  className?: string;
}

const MOST_FOLLOWED_COUNT = 5;

export function FeaturedNews({ featured, breaking, className }: FeaturedNewsProps) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const topNews = [...breaking, ...featured.filter((f) => !breaking.some((b) => b.id === f.id))];

  if (topNews.length === 0) {
    return null;
  }

  const mainNews = topNews[0];
  const mostFollowed = topNews.slice(1, 1 + MOST_FOLLOWED_COUNT);
  const title = isRTL ? mainNews.titleAr : mainNews.title;
  const tag = mainNews.isBreaking ? (isRTL ? 'عاجل' : 'Breaking') : (isRTL ? mainNews.source.nameAr : mainNews.source.name);
  const timeAgo = formatRelativeTime(mainNews.publishedAt, language);

  return (
    <section className={cn('grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4', className)}>
      {/* Main featured story */}
      <Link
        href={newsDetailPath(mainNews.id, mainNews.slug, mainNews.title)}
        className="group relative block card-surface overflow-hidden h-[320px]"
      >
        <NewsImage src={mainNews.thumbnail} alt={title} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute bottom-0 start-0 end-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[11px] font-semibold text-black">
              {mainNews.isBreaking && <Zap className="w-3 h-3" />}
              {tag}
            </span>
            <span className="num text-[12px] text-white/75">{timeAgo}</span>
          </div>
          <h2 className="font-heading text-2xl font-semibold text-white line-clamp-2 leading-snug">
            {title}
          </h2>
        </div>
      </Link>

      {/* Most followed */}
      {mostFollowed.length > 0 && (
        <SectionCard title={t.pages.news.mostFollowed}>
          <ol className="divide-y divide-line2">
            {mostFollowed.map((item, index) => {
              const itemTitle = isRTL ? item.titleAr : item.title;
              return (
                <li key={item.id}>
                  <Link
                    href={newsDetailPath(item.id, item.slug, item.title)}
                    className="group flex items-start gap-3 px-5 py-3 hover:bg-hover transition-colors"
                  >
                    <span className="num text-[13px] font-semibold text-gold shrink-0 w-5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-heading text-[13.5px] leading-snug text-text line-clamp-2 group-hover:text-gold transition-colors">
                      {itemTitle}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </SectionCard>
      )}
    </section>
  );
}
