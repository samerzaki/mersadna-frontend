'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { useNewsDetail, useNewsList } from '@/hooks/use-news';
import { useReadingPreferences } from '@/hooks/use-reading-preferences';
import { useLanguage } from '@/contexts/language-context';
import { useGoldOverview } from '@/hooks/use-gold-prices';
import { useCurrencyAverages } from '@/hooks/use-currency-prices';
import { formatRelativeTime } from '@/lib/format';
import {
  NewsMeta,
  BookmarkButton,
  ShareButtons,
  RelatedNews,
  ReadingToolbar,
} from '@/components/news';
import { NewsImage } from '@/components/ui/news-image';
import { SectionCard } from '@/components/ui/section-card';
import { ChangeText } from '@/components/ui/change-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/components/ui/api-error';
import { MarkdownContent } from '@/components/news/markdown-content';
import { formatPriceWithCurrency } from '@/lib/format';

const RELATED_FALLBACK_COUNT = 4;

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const { data, isLoading, error, refetch } = useNewsDetail(slug);
  const reading = useReadingPreferences();

  const news = data?.data.news;
  const relatedNewsFromApi = data?.data.relatedNews ?? [];

  // Fallback: adapter currently returns an empty relatedNews array — use the
  // latest news list (minus the current article) when nothing came back.
  const { data: fallbackListData } = useNewsList(undefined, 1, !isLoading && relatedNewsFromApi.length === 0);
  const relatedNews = relatedNewsFromApi.length > 0
    ? relatedNewsFromApi
    : (fallbackListData?.data.news ?? []).filter((item) => item.id !== news?.id).slice(0, RELATED_FALLBACK_COUNT);

  const { data: goldData } = useGoldOverview();
  const { data: usdData } = useCurrencyAverages('USD');

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <Skeleton className="h-[320px] w-full rounded-2xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <ApiError error={error} retry={refetch} />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-text mb-4">
          {isRTL ? 'الخبر غير موجود' : 'News not found'}
        </h1>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-gold hover:underline"
        >
          <BackArrow className="w-4 h-4" />
          {t.pages.news.backToNews}
        </Link>
      </div>
    );
  }

  const title = isRTL ? news.titleAr : news.title;
  const content = isRTL ? news.contentAr : news.content;
  const tag = news.isBreaking ? (isRTL ? 'عاجل' : 'Breaking') : (isRTL ? news.source.nameAr : news.source.name);
  const timeAgo = formatRelativeTime(news.publishedAt, language);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const gold21 = goldData?.data.gold['21'];
  const usdBankSell = usdData?.data.banks.avg_sell_rate;

  return (
    <>
      {/* Reading Mode Overlay */}
      {reading.isReadingMode && (
        <div className="fixed inset-0 z-50 bg-bg overflow-y-auto">
          <ReadingToolbar
            fontSize={reading.fontSize}
            isReadingMode={reading.isReadingMode}
            canIncrease={reading.canIncrease}
            canDecrease={reading.canDecrease}
            onIncrease={reading.increaseFontSize}
            onDecrease={reading.decreaseFontSize}
            onToggleReadingMode={reading.toggleReadingMode}
          />

          <div className="max-w-3xl mx-auto py-8 px-6 md:py-12 md:px-8">
            <button
              onClick={reading.toggleReadingMode}
              className="mb-8 p-2 rounded-full hover:bg-hover transition-colors text-muted"
              aria-label={isRTL ? 'إغلاق وضع القراءة' : 'Close reading mode'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-text mb-4 leading-tight">
              {title}
            </h2>

            {news.excerpt && (
              <p className="text-lg text-muted mb-6 leading-relaxed">
                {isRTL ? news.excerptAr : news.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-line2">
              <NewsMeta
                publishedAt={news.publishedAt}
                readingTimeMinutes={news.readingTimeMinutes}
                showSource={false}
                showViews={false}
                showReadingTime={false}
              />
            </div>

            <MarkdownContent
              content={content}
              style={{ fontSize: `${reading.fontSize}px` }}
            />
          </div>
        </div>
      )}

      {/* Normal Article View */}
      <div>
        {!reading.isReadingMode && (
          <ReadingToolbar
            fontSize={reading.fontSize}
            isReadingMode={reading.isReadingMode}
            canIncrease={reading.canIncrease}
            canDecrease={reading.canDecrease}
            onIncrease={reading.increaseFontSize}
            onDecrease={reading.decreaseFontSize}
            onToggleReadingMode={reading.toggleReadingMode}
          />
        )}

        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-gold mb-6 pt-8 transition-colors"
        >
          <BackArrow className="w-4 h-4" />
          {t.pages.news.backToNews}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 pb-16">
          {/* Article column */}
          <article>
            <div className="flex items-center gap-2 mb-3">
              <span className="chip inline-flex items-center gap-1">
                {news.isBreaking && <Zap className="w-3 h-3" />}
                {tag}
              </span>
              <span className="num text-[12px] text-dim">{timeAgo}</span>
            </div>

            <h1 className="font-heading text-[28px] md:text-[34px] font-semibold text-text mb-6 leading-[1.45]">
              {title}
            </h1>

            <div className="relative h-[320px] rounded-2xl overflow-hidden mb-8">
              <NewsImage src={news.thumbnail} alt={title} className="w-full h-full" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-line2">
              <NewsMeta
                publishedAt={news.publishedAt}
                readingTimeMinutes={news.readingTimeMinutes}
                viewCount={news.viewCount}
                showSource={false}
                showViews={true}
                showReadingTime={true}
              />
              <div className="flex items-center gap-2">
                <BookmarkButton news={news} variant="button" />
                <ShareButtons url={shareUrl} title={title} variant="icons" />
              </div>
            </div>

            {(news.keyPoints?.length ?? 0) > 0 && (
              <section className="mb-8 rounded-2xl bg-gold-soft p-5">
                <h3 className="font-heading mb-3 text-[15px] font-semibold text-text">
                  {isRTL ? 'أهم النقاط' : 'Key points'}
                </h3>
                <ul className="list-disc space-y-2 ps-5 text-[14px] text-text">
                  {news.keyPoints?.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}
                </ul>
              </section>
            )}

            <MarkdownContent content={content} />

            {news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-line2">
                {news.tags.map((tagItem) => (
                  <span key={tagItem} className="chip">#{tagItem}</span>
                ))}
              </div>
            )}
          </article>

          {/* Aside */}
          <aside className="space-y-6">
            {(gold21 || usdBankSell !== undefined) && (
              <SectionCard title={t.pages.news.quickPrices}>
                <div className="divide-y divide-line2">
                  {gold21 && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="font-heading text-[13.5px] text-text">
                        {isRTL ? 'عيار 21' : 'Karat 21'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="num text-[14px] font-semibold text-text">
                          {formatPriceWithCurrency(gold21.sell_price, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                        </span>
                        <ChangeText value={gold21.spread_percent} className="text-[11.5px]" />
                      </div>
                    </div>
                  )}
                  {usdBankSell !== undefined && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="font-heading text-[13.5px] text-text">
                        {isRTL ? 'الدولار' : 'USD'}
                      </span>
                      <span className="num text-[14px] font-semibold text-text">
                        {formatPriceWithCurrency(usdBankSell, 'EGP', isRTL ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {relatedNews.length > 0 && (
              <SectionCard title={t.pages.news.relatedNews}>
                <RelatedNews news={relatedNews} />
              </SectionCard>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
