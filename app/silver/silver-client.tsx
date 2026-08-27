'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertCircle, Calculator, Bell } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useAllSilverPrices } from '@/hooks/use-silver-prices';
import { SilverOverviewItem } from '@/types';
import { formatPriceWithCurrency, formatPercent } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { LastUpdateIndicator } from '@/components/ui/last-update-indicator';
import { PriceAlertModal } from '@/components/dashboard/price-alert-modal';

// Silver product names mapping (all products)
const SILVER_NAMES: Record<string, { ar: string; en: string }> = {
  '11': { ar: 'فضة 999 سويسري', en: 'Silver 999 Swiss' },
  '15': { ar: 'فضة 999 مصري', en: 'Silver 999 Egyptian' },
  '16': { ar: 'فضة 980', en: 'Silver 980' },
  '17': { ar: 'فضة 925', en: 'Silver 925' },
  '18': { ar: 'فضة 800', en: 'Silver 800' },
  '19': { ar: 'أونصة الفضة العالمية', en: 'Global Silver Ounce' },
};

function getSilverName(key: string, isRTL: boolean): string {
  return SILVER_NAMES[key]?.[isRTL ? 'ar' : 'en'] ?? (isRTL ? `فضة ${key}` : `Silver ${key}`);
}

interface SilverDataItem {
  id: string;
  name: string;
  sellPrice: number;
  buyPrice: number;
  spreadEgp: number;
  spreadPercent: number;
  trend: 'up' | 'down' | 'neutral';
  chartPoints: number[];
  currency: string;
  recordedAt: string;
}

function Sparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const width = 120;
  const height = 32;
  const padding = 4;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

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

  const gradientId = `silver-gradient-${isPositive ? 'up' : 'down'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
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

function SilverPriceCard({ item, t, locale }: { item: SilverDataItem; t: any; locale: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPositive = item.trend === 'up';
  const isOunce = item.id === '19';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const spread = item.sellPrice - item.buyPrice;

  return (
    <>
      <div className="group relative bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-border">
        <div className="space-y-4 p-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-foreground">
                {item.name}
              </h3>
            </div>
            <LastUpdateIndicator recordedAt={item.recordedAt} />
          </div>

          {/* Main Price (Sell) */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground mb-1">
              {isOunce ? (locale === 'ar-EG' ? 'السعر الحالى' : 'Current Price') : t.gold.sellPrice}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-foreground tabular-nums">
              {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
            </p>
          </div>

          {/* Buy Price */}
          {!isOunce && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground mb-0.5">{t.gold.buyPrice}</p>
              <p className="text-lg font-medium text-slate-600 dark:text-muted-foreground tabular-nums">
                {formatPriceWithCurrency(item.buyPrice, item.currency, locale)}
              </p>
            </div>
          )}

          {/* Spread */}
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

          {/* Trend + Sparkline */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {item.trend === 'neutral' ? (
                <>
                  <Minus className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-400 tabular-nums">0%</span>
                </>
              ) : (
                <>
                  <TrendIcon
                    className={`h-4 w-4 ${isPositive ? 'text-green-600 dark:text-success' : 'text-red-600 dark:text-red-400'}`}
                  />
                  <span
                    className={`text-sm font-semibold tabular-nums ${isPositive ? 'text-green-600 dark:text-success' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {formatPercent(item.spreadPercent)}
                  </span>
                </>
              )}
            </div>
            {item.chartPoints.length > 1 && (
              <Sparkline data={item.chartPoints} isPositive={isPositive} />
            )}
          </div>
        </div>

        {/* Notification Bell - Hover */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 end-2 p-1.5 rounded-full bg-primary-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-primary-700 hover:scale-110 transform"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>

      <PriceAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goldType={item.name}
        currentPrice={item.sellPrice}
        currency={item.currency}
      />
    </>
  );
}

function transformApiItem(key: string, data: SilverOverviewItem, isRTL: boolean): SilverDataItem {
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (data.spread_percent > 0) trend = 'up';
  else if (data.spread_percent < 0) trend = 'down';

  return {
    id: key,
    name: getSilverName(key, isRTL),
    sellPrice: data.sell_price,
    buyPrice: data.buy_price,
    spreadEgp: data.spread_egp,
    spreadPercent: data.spread_percent,
    trend,
    chartPoints: data.chart_points ?? [],
    currency: data.currency,
    recordedAt: data.recorded_at,
  };
}

function LoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}

export default function SilverPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const locale = language === 'en' ? 'en-US' : 'ar-EG';
  const { data, isLoading, error } = useAllSilverPrices('EGP', '30d');

  const features = [
    {
      icon: Calculator,
      title: isRTL ? 'حاسبة الفضة' : 'Silver Calculator',
      description: isRTL ? 'احسب قيمة الفضة بالوزن' : 'Calculate silver value by weight',
      href: '/silver/calculator',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      icon: Bell,
      title: isRTL ? 'تنبيهات الأسعار' : 'Price Alerts',
      description: isRTL ? 'احصل على إشعارات عند تغير الأسعار' : 'Get notified on price changes',
      href: '/me/alerts',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  // Transform API data
  const silverItems: SilverDataItem[] = [];
  if (data?.data?.silver) {
    Object.entries(data.data.silver).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'sell_price' in value) {
        silverItems.push(transformApiItem(key, value as SilverOverviewItem, isRTL));
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Sparkles className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {isRTL ? 'أسعار الفضة' : 'Silver Prices'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isRTL ? 'أسعار الفضة المحدثة لحظياً - جميع الأنواع' : 'Live silver prices - All types'}
              </p>
            </div>
          </div>
        </div>

        {/* Silver Price Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : error || !data ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  {isRTL ? 'خطأ في تحميل البيانات' : 'Error loading data'}
                </h3>
                <p className="text-sm text-red-700">
                  {error instanceof Error ? error.message : (isRTL ? 'فشل في تحميل أسعار الفضة' : 'Failed to load silver prices')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {silverItems.map((item) => (
              <SilverPriceCard key={item.id} item={item} t={t} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all"
          >
            <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
