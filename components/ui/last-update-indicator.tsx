// Last Update Indicator - Shows live icon or last update time
'use client';

import { useEffect, useState } from 'react';
import { formatLastUpdate, isPriceLive, formatDateTime } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { translations, type Language } from '@/lib/translations';

interface LastUpdateIndicatorProps {
  recordedAt?: string | Date | null;
  /** Server timestamp to make a streamed render deterministic during hydration. */
  referenceTime?: string;
  showFullDate?: boolean;
  className?: string;
}

export function LastUpdateIndicator({
  recordedAt,
  referenceTime,
  showFullDate = false,
  className = ''
}: LastUpdateIndicatorProps) {
  const { language } = useLanguage();
  // Match the server language while a streamed parent boundary hydrates, then
  // apply any preference restored from localStorage.
  const [displayLanguage, setDisplayLanguage] = useState<Language>('ar');

  useEffect(() => {
    setDisplayLanguage(language);
  }, [language]);

  const t = translations[displayLanguage];

  // If no recordedAt provided, don't show anything
  if (!recordedAt) {
    return null;
  }

  const isLive = isPriceLive(recordedAt, referenceTime);
  const displayText = showFullDate
    ? formatDateTime(recordedAt, displayLanguage)
    : formatLastUpdate(recordedAt, displayLanguage, referenceTime);

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
