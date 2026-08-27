// Last Update Indicator - Shows live icon or last update time
'use client';

import { formatLastUpdate, isPriceLive, formatDateTime } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';

interface LastUpdateIndicatorProps {
  recordedAt?: string | Date | null;
  showFullDate?: boolean;
  className?: string;
}

export function LastUpdateIndicator({
  recordedAt,
  showFullDate = false,
  className = ''
}: LastUpdateIndicatorProps) {
  const { language, t } = useLanguage();

  // If no recordedAt provided, don't show anything
  if (!recordedAt) {
    return null;
  }

  const isLive = isPriceLive(recordedAt);
  const displayText = showFullDate ? formatDateTime(recordedAt, language) : formatLastUpdate(recordedAt, language);

  return (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      {isLive ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            {displayText}
          </span>
        </>
      ) : (
        <>
          <span className="text-gray-500 dark:text-gray-400">
            {t.currency.lastUpdatePrefix} {displayText}
          </span>
        </>
      )}
    </div>
  );
}
