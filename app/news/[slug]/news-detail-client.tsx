'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { useNewsDetail } from '@/hooks/use-news';
import { useReadingPreferences } from '@/hooks/use-reading-preferences';
import { useLanguage } from '@/contexts/language-context';
import {
  NewsMeta,
  BookmarkButton,
  ShareButtons,
  RelatedNews,
  ReadingToolbar,
} from '@/components/news';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/components/ui/api-error';
import { MarkdownContent } from '@/components/news/markdown-content';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const { data, isLoading, error, refetch } = useNewsDetail(slug);
  const reading = useReadingPreferences();

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl mb-8" />
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
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ApiError error={error} retry={refetch} />
      </div>
    );
  }

  if (!data?.data.news) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {isRTL ? 'الخبر غير موجود' : 'News not found'}
        </h1>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <BackArrow className="w-4 h-4" />
          {isRTL ? 'العودة للأخبار' : 'Back to News'}
        </Link>
      </div>
    );
  }

  const news = data.data.news;
  const relatedNews = data.data.relatedNews;
  const title = isRTL ? news.titleAr : news.title;
  const content = isRTL ? news.contentAr : news.content;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      {/* Reading Mode Overlay */}
      {reading.isReadingMode && (
        <div className="fixed inset-0 z-50 bg-[#faf8f5] dark:bg-slate-950 overflow-y-auto">
          {/* Reading Toolbar - inside overlay */}
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
            {/* Close button */}
            <button
              onClick={reading.toggleReadingMode}
              className="mb-8 p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              aria-label={isRTL ? 'إغلاق وضع القراءة' : 'Close reading mode'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              {title}
            </h2>

            {/* Excerpt / Description */}
            {news.excerpt && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {isRTL ? news.excerptAr : news.excerpt}
              </p>
            )}

            {/* Meta info line */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
              <NewsMeta
                publishedAt={news.publishedAt}
                readingTimeMinutes={news.readingTimeMinutes}
                showSource={false}
                showViews={false}
                showReadingTime={false}
              />
            </div>

            {/* Article Content */}
            <MarkdownContent
              content={content}
              className="prose prose-slate dark:prose-invert max-w-none reading-mode-article"
              style={{ fontSize: `${reading.fontSize}px` }}
            />

            {/* Tags at bottom */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
                {news.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Normal Article View */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Reading Toolbar - on normal view */}
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
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <BackArrow className="w-4 h-4" />
          {isRTL ? 'العودة للأخبار' : 'Back to News'}
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          {/* Breaking badge */}
          {news.isBreaking && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full">
                <Zap className="w-3 h-3" />
                {isRTL ? 'عاجل' : 'Breaking'}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            {title}
          </h2>

          {/* Meta info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <NewsMeta
              publishedAt={news.publishedAt}
              readingTimeMinutes={news.readingTimeMinutes}
              viewCount={news.viewCount}
              showSource={false}
              showViews={true}
              showReadingTime={false}
            />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <BookmarkButton news={news} variant="button" />
              <ShareButtons url={shareUrl} title={title} variant="icons" />
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8">
          <Image
            src={news.thumbnail}
            alt={title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        {(news.keyPoints?.length ?? 0) > 0 && (
          <section className="mb-8 rounded-xl border border-primary-100 bg-primary-50/60 p-5 dark:border-primary-900/50 dark:bg-primary-950/20">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isRTL ? 'أهم النقاط' : 'Key points'}
            </h3>
            <ul className="list-disc space-y-2 ps-5 text-slate-700 dark:text-slate-300">
              {news.keyPoints?.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}
            </ul>
          </section>
        )}

        {/* Article Content */}
        <MarkdownContent
          content={content}
          className="prose prose-slate dark:prose-invert max-w-none mb-12"
          style={{ fontSize: `${reading.fontSize}px` }}
        />

        {news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            {news.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related News */}
        {relatedNews && relatedNews.length > 0 && (
          <RelatedNews news={relatedNews} />
        )}
      </div>
    </>
  );
}
