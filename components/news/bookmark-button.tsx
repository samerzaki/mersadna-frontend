'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { NewsItem, BookmarkedNews } from '@/types';
import { useNewsBookmarks } from '@/hooks/use-news';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  news: NewsItem | BookmarkedNews;
  variant?: 'icon' | 'button';
  className?: string;
}

export function BookmarkButton({ news, variant = 'icon', className }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useNewsBookmarks();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const bookmarked = isBookmarked(news.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    toggleBookmark(news);
  };

  if (variant === 'button') {
    return (
      <Button
        variant={bookmarked ? 'default' : 'outline'}
        size="sm"
        onClick={handleClick}
        className={cn('gap-2', className)}
      >
        {bookmarked ? (
          <>
            <BookmarkCheck className="w-4 h-4" />
            {isRTL ? 'محفوظ' : 'Saved'}
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            {isRTL ? 'حفظ' : 'Save'}
          </>
        )}
      </Button>
    );
  }

  // Icon variant
  return (
    <button
      onClick={handleClick}
      className={cn(
        'p-2 rounded-full transition-all',
        bookmarked
          ? 'bg-primary-600 text-white hover:bg-primary-700'
          : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800',
        className
      )}
      aria-label={bookmarked ? 'Remove from saved' : 'Save article'}
    >
      {bookmarked ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </button>
  );
}
