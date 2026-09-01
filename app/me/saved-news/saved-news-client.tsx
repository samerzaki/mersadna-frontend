'use client';

import Link from 'next/link';
import { Bookmark, Newspaper, Trash2 } from 'lucide-react';
import { useNewsBookmarks } from '@/hooks/use-news';
import { useLanguage } from '@/contexts/language-context';
import { newsDetailPath } from '@/lib/news-routes';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SavedNewsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { bookmarks, removeBookmark, isLoaded } = useNewsBookmarks();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isRTL ? 'الأخبار المحفوظة' : 'Saved News'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRTL
                ? `${bookmarks.length} خبر محفوظ`
                : `${bookmarks.length} saved article${bookmarks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {!isLoaded && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse flex gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isLoaded && bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {isRTL ? 'لا توجد أخبار محفوظة' : 'No saved news'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            {isRTL
              ? 'احفظ الأخبار التي تهمك لقراءتها لاحقاً'
              : 'Save news articles that interest you to read later'}
          </p>
          <Button asChild>
            <Link href="/news" className="gap-2">
              <Newspaper className="w-4 h-4" />
              {isRTL ? 'تصفح الأخبار' : 'Browse News'}
            </Link>
          </Button>
        </div>
      )}

      {/* Saved news list */}
      {isLoaded && bookmarks.length > 0 && (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const title = isRTL ? bookmark.titleAr : bookmark.title;
            const excerpt = isRTL ? bookmark.excerptAr : bookmark.excerpt;

            return (
              <div
                key={bookmark.id}
                className="group flex gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all"
              >
                {/* Thumbnail */}
                <Link
                  href={newsDetailPath(bookmark.id, bookmark.slug, bookmark.title)}
                  className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <Image
                    src={bookmark.thumbnail}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={newsDetailPath(bookmark.id, bookmark.slug, bookmark.title)}
                        className="block group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                      >
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                          {title}
                        </h3>
                      </Link>
                      {excerpt && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                      aria-label={isRTL ? 'إزالة من المحفوظات' : 'Remove from saved'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Saved date */}
                  <p className="text-xs text-slate-400 mt-2">
                    {isRTL ? 'تم الحفظ: ' : 'Saved: '}
                    {new Date(bookmark.bookmarkedAt).toLocaleDateString(
                      isRTL ? 'ar-EG-u-nu-latn' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
