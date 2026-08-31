'use client';

import { Clock, Calendar, Eye } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { NewsSource } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface NewsMetaProps {
  source?: NewsSource;
  publishedAt: string;
  readingTimeMinutes: number;
  viewCount?: number;
  showSource?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showViews?: boolean;
  variant?: 'inline' | 'stacked';
  className?: string;
}

export function NewsMeta({
  source,
  publishedAt,
  readingTimeMinutes,
  viewCount,
  showSource = true,
  showDate = true,
  showReadingTime = true,
  showViews = false,
  variant = 'inline',
  className,
}: NewsMetaProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const locale = isRTL ? ar : enUS;

  const timeAgo = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale,
  });

  const fullDate = format(new Date(publishedAt), 'PPP', { locale });

  if (variant === 'stacked') {
    return (
      <div className={cn('space-y-2', className)}>
        {showSource && source && (
          <div className="flex items-center gap-2">
            {source.logo && (
              <img
                src={source.logo}
                alt={isRTL ? source.nameAr : source.name}
                className="w-5 h-5 rounded object-contain"
              />
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isRTL ? source.nameAr : source.name}
            </span>
          </div>
        )}
        {showDate && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span title={fullDate}>{timeAgo}</span>
          </div>
        )}
        {showReadingTime && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span>
              {readingTimeMinutes} {isRTL ? 'دقائق للقراءة' : 'min read'}
            </span>
          </div>
        )}
        {showViews && viewCount !== undefined && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Eye className="w-4 h-4" />
            <span>
              {viewCount.toLocaleString('en-US')} {isRTL ? 'مشاهدة' : 'views'}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Inline variant
  return (
    <div className={cn('flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400', className)}>
      {showSource && source && (
        <div className="flex items-center gap-1.5">
          {source.logo && (
            <img
              src={source.logo}
              alt={isRTL ? source.nameAr : source.name}
              className="w-4 h-4 rounded object-contain"
            />
          )}
          <span className="font-medium">{isRTL ? source.nameAr : source.name}</span>
        </div>
      )}
      {showDate && (
        <div className="flex items-center gap-1.5" title={fullDate}>
          <Calendar className="w-4 h-4" />
          <span>{timeAgo}</span>
        </div>
      )}
      {showReadingTime && (
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>
            {readingTimeMinutes} {isRTL ? 'د' : 'm'}
          </span>
        </div>
      )}
      {showViews && viewCount !== undefined && (
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span>{viewCount.toLocaleString('en-US')}</span>
        </div>
      )}
    </div>
  );
}
