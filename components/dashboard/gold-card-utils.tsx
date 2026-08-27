'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPercent, isPriceLive } from '@/lib/format';

// Re-export shared types and utilities so existing client imports still work
export { type GoldDataItem, transformApiDataToGoldDataItem } from './gold-data-utils';

/**
 * Get translated name for gold type
 */
export const getName = (
  nameKey: string,
  t: {
    gold: {
      karat24: string;
      karat21: string;
      karat18: string;
      pound: string;
      ounce: string;
    };
  }
) => {
  const names: Record<string, string> = {
    karat24: t.gold.karat24,
    karat21: t.gold.karat21,
    karat18: t.gold.karat18,
    pound: t.gold.pound,
    ounce: t.gold.ounce,
  };
  return names[nameKey] || nameKey;
};

/**
 * Live indicator component - shows animated green dot if data is fresh
 */
export function LiveIndicator({ recordedAt }: { recordedAt?: string | null }) {
  if (!recordedAt || !isPriceLive(recordedAt)) {
    return null;
  }

  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
  );
}

/**
 * Trend indicator component - shows up/down arrow with percentage
 */
export function TrendIndicator({ trend, changePercent }: { trend: 'up' | 'down' | 'neutral'; changePercent: number }) {
  if (trend === 'neutral' || changePercent === 0) {
    return (
      <div className="flex items-center gap-1">
        <Minus className="h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground" />
        <span className="text-xs font-medium text-slate-400 dark:text-muted-foreground tabular-nums">0%</span>
      </div>
    );
  }

  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-600 dark:text-success' : 'text-red-600 dark:text-red-400';

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <TrendIcon className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold tabular-nums">
        {formatPercent(changePercent)}
      </span>
    </div>
  );
}
