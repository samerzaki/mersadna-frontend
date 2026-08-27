'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPercent, formatPriceWithCurrency } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { LastUpdateIndicator } from '@/components/ui/last-update-indicator';
import type { ModernGoldDataItem } from './modern-gold-prices-server';

interface GoldPriceCardProps {
  item: ModernGoldDataItem;
  isHero?: boolean;
  t: any;
}

const getName = (nameKey: string, t: any) => {
  const names: Record<string, string> = {
    karat24: t.gold.karat24,
    karat21: t.gold.karat21,
    karat18: t.gold.karat18,
    pound: t.gold.pound,
    ounce: t.gold.ounce,
  };
  return names[nameKey] || nameKey;
};

function Sparkline({ 
  data, 
  isPositive 
}: { 
  data: number[]; 
  isPositive: boolean;
}) {
  const width = 120;
  const height = 32;
  const padding = 4;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Normalize data to fit within the inner area
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * innerWidth;
    const y = padding + innerHeight - ((value - min) / range) * innerHeight;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaPath = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  const gradientId = `gradient-${isPositive ? 'up' : 'down'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoldPriceCard({ item, isHero = false, t }: GoldPriceCardProps) {
  const { language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'ar-EG';
  const spread = item.sellPrice - item.buyPrice;
  const isPositive = item.trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // Determine if this is USD currency (for ounce)
  const isUSD = item.currency === 'USD';
  const isOunce = item.nameKey === 'ounce';

  // Display currency based on item currency (USD for ounce, EGP for others)
  const currencyDisplay = isUSD ? 'USD' : t.common.egp;

  return (
    <div
      className={`
        bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm
        transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-border
        ${isHero ? 'md:col-span-1 border-slate-300 dark:border-border shadow-md' : ''}
      `}
    >
      <div className={`space-y-4 ${isHero ? 'p-6' : 'p-5'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-foreground">
              {getName(item.nameKey, t)}
            </h3>
          </div>
          <LastUpdateIndicator recordedAt={item.recordedAt} />
        </div>

        {/* Main Price (Sell) */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground mb-1">
            {isOunce ? 'السعر الحالى' : t.gold.sellPrice}
          </p>
          <p className={`font-bold text-slate-900 dark:text-foreground tabular-nums ${isHero ? 'text-4xl' : 'text-3xl'}`}>
            {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
          </p>
        </div>

        {/* Secondary Price (Buy) - Hidden for ounce */}
        {!isOunce && (
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground mb-0.5">{t.gold.buyPrice}</p>
            <p className="text-lg font-medium text-slate-600 dark:text-muted-foreground tabular-nums">
              {formatPriceWithCurrency(item.buyPrice, item.currency, locale)}
            </p>
          </div>
        )}

        {/* Spread - Hidden for ounce */}
        {!isOunce && (
          <div className="pt-2 border-t border-slate-100 dark:border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-muted-foreground">{t.gold.spread}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-foreground tabular-nums">
                {formatPriceWithCurrency(spread, item.currency, locale)}
              </span>
            </div>
          </div>
        )}

        {/* Trend */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <TrendIcon
              className={`h-4 w-4 ${
                isPositive ? 'text-green-600 dark:text-success' : 'text-red-600 dark:text-red-400'
              }`}
            />
            <span
              className={`text-sm font-semibold tabular-nums ${
                isPositive ? 'text-green-600 dark:text-success' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatPercent(item.changePercent)}
            </span>
          </div>
          <Sparkline data={item.history} isPositive={isPositive} />
        </div>
      </div>
    </div>
  );
}

interface ModernGoldPricesClientProps {
  goldData: ModernGoldDataItem[];
}

export function ModernGoldPricesClient({ goldData }: ModernGoldPricesClientProps) {
  const { t } = useLanguage();

  // Separate hero and secondary items
  const heroItems = goldData.filter((item) =>
    item.id === 'k21' || item.id === 'pound'
  );
  const secondaryItems = goldData.filter(
    (item) => item.id !== 'k21' && item.id !== 'pound'
  );

  return (
    <div className="space-y-6">
      {/* Hero Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {heroItems.map((item) => (
          <GoldPriceCard key={item.id} item={item} isHero t={t} />
        ))}
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryItems.map((item) => (
          <GoldPriceCard key={item.id} item={item} t={t} />
        ))}
      </div>
    </div>
  );
}
