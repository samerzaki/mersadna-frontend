'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Calculator, Bell } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useAllSilverPrices } from '@/hooks/use-silver-prices';
import { SilverAllPricesItem } from '@/types';
import { formatPriceWithCurrency, formatPercent } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { LastUpdateIndicator } from '@/components/ui/last-update-indicator';
import { PriceAlertModal } from '@/components/dashboard/price-alert-modal';
import { PageHeader } from '@/components/ui/page-header';
import { Sparkline } from '@/components/ui/sparkline';
import { cn } from '@/lib/utils';

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

function SilverPriceCard({ item, t, locale }: { item: SilverDataItem; t: any; locale: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPositive = item.trend === 'up';
  const isOunce = item.id === '19';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const spread = item.sellPrice - item.buyPrice;

  return (
    <>
      <div className="group relative card-surface transition-shadow hover:shadow-gold">
        <div className="space-y-4 p-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-dim" />
              <h3 className="font-heading text-base font-semibold text-text">
                {item.name}
              </h3>
            </div>
            <LastUpdateIndicator recordedAt={item.recordedAt} />
          </div>

          {/* Main Price (Sell) */}
          <div>
            <p className="text-xs font-medium text-muted mb-1">
              {isOunce ? (locale === 'ar-EG' ? 'السعر الحالى' : 'Current Price') : t.gold.sellPrice}
            </p>
            <p className="num text-3xl font-bold text-text">
              {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
            </p>
          </div>

          {/* Buy Price */}
          {!isOunce && (
            <div>
              <p className="text-xs font-medium text-muted mb-0.5">{t.gold.buyPrice}</p>
              <p className="num text-lg font-medium text-muted">
                {formatPriceWithCurrency(item.buyPrice, item.currency, locale)}
              </p>
            </div>
          )}

          {/* Spread */}
          {!isOunce && (
            <div className="pt-2 border-t border-line">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">{t.gold.spread}</span>
                <span className="num text-sm font-semibold text-text">
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
                  <Minus className="h-4 w-4 text-dim" />
                  <span className="num text-sm font-semibold text-dim">0%</span>
                </>
              ) : (
                <>
                  <TrendIcon
                    className={cn('h-4 w-4', isPositive ? 'text-up' : 'text-down')}
                  />
                  <span
                    className={cn('num text-sm font-semibold', isPositive ? 'text-up' : 'text-down')}
                  >
                    {formatPercent(item.spreadPercent)}
                  </span>
                </>
              )}
            </div>
            {item.chartPoints.length > 1 && (
              <Sparkline data={item.chartPoints} width={120} height={32} tone={item.trend === 'neutral' ? 'gold' : isPositive ? 'up' : 'down'} />
            )}
          </div>
        </div>

        {/* Notification Bell - Hover */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 end-2 p-1.5 rounded-full bg-gold text-on-gold opacity-0 group-hover:opacity-100 transition-opacity shadow-gold hover:scale-110 transform"
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

function transformApiItem(key: string, data: SilverAllPricesItem, isRTL: boolean): SilverDataItem {
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
    <div className="card-surface p-5">
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
        silverItems.push(transformApiItem(key, value as SilverAllPricesItem, isRTL));
      }
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isRTL ? 'الفضة' : 'Silver'}
        title={isRTL ? 'أسعار الفضة' : 'Silver Prices'}
        lead={isRTL ? 'أسعار الفضة المحدثة لحظياً - جميع الأنواع' : 'Live silver prices - All types'}
      />

      {/* Silver Price Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : error || !data ? (
        <div className="card-surface p-6 border border-down/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-down" />
            <div>
              <h3 className="font-semibold text-text">
                {isRTL ? 'خطأ في تحميل البيانات' : 'Error loading data'}
              </h3>
              <p className="text-sm text-muted">
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group card-surface p-6 hover:shadow-gold transition-shadow"
          >
            <div className="inline-flex p-3 rounded-lg bg-gold-soft mb-4">
              <feature.icon className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text mb-2 group-hover:text-gold transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-muted">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
