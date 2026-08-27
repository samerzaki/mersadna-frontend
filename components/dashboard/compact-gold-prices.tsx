'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertCircle, Bell } from 'lucide-react';
import { formatPriceWithCurrency, formatPercent, isPriceLive } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { useGoldOverview } from '@/hooks/use-gold-prices';
import { GoldOverviewItem, GoldOunceItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceAlertModal } from './price-alert-modal';

interface GoldDataItem {
  id: string;
  nameKey: 'karat21' | 'karat24' | 'karat18' | 'pound' | 'ounce';
  karat: string;
  sellPrice: number;
  buyPrice: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  currency: string;
  recordedAt: string;
}

interface CompactGoldCardProps {
  item: GoldDataItem;
  t: ReturnType<typeof useLanguage>['t'];
}

const getName = (nameKey: string, t: ReturnType<typeof useLanguage>['t']) => {
  const names: Record<string, string> = {
    karat24: t.gold.karat24,
    karat21: t.gold.karat21,
    karat18: t.gold.karat18,
    pound: t.gold.pound,
    ounce: t.gold.ounce,
  };
  return names[nameKey] || nameKey;
};

function LiveIndicator({ recordedAt }: { recordedAt?: string | null }) {
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

function TrendIndicator({ trend, changePercent }: { trend: 'up' | 'down' | 'neutral'; changePercent: number }) {
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

function CompactGoldCard({ item, t }: CompactGoldCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'ar-EG';
  const isOunce = item.nameKey === 'ounce';

  return (
    <>
      <div className="group relative bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm p-4 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-foreground">
              {getName(item.nameKey, t)}
            </h3>
          </div>
          <LiveIndicator recordedAt={item.recordedAt} />
        </div>

        {/* Sell Price (Primary) */}
        <div className="mb-2">
          <p className="text-[11px] font-medium text-slate-500 dark:text-muted-foreground mb-0.5">{t.gold.sellPrice}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-foreground tabular-nums">
            {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
          </p>
        </div>

        {/* Buy Price + Trend (same row) - Hidden for Global Ounce */}
        {!isOunce && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-muted-foreground mb-0.5">{t.gold.buyPrice}</p>
              <p className="text-base font-medium text-slate-600 dark:text-muted-foreground tabular-nums">
                {formatPriceWithCurrency(item.buyPrice, item.currency, locale)}
              </p>
            </div>
            <TrendIndicator trend={item.trend} changePercent={item.changePercent} />
          </div>
        )}

        {/* Notification Bell Icon - Appears on Hover */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 end-2 p-1.5 rounded-full bg-primary-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-primary-700 hover:scale-110 transform"
          title={t.alerts?.createAlert || 'إنشاء تنبيه'}
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goldType={getName(item.nameKey, t)}
        currentPrice={item.sellPrice}
        currency={item.currency}
      />
    </>
  );
}

function PlaceholderCard({ t }: { t: ReturnType<typeof useLanguage>['t'] }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-secondary dark:to-card rounded-lg border border-dashed border-slate-300 dark:border-border p-4 flex flex-col items-center justify-center min-h-[140px]">
      <Sparkles className="h-6 w-6 text-slate-400 dark:text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-slate-500 dark:text-muted-foreground text-center">
        {t.common?.comingSoon || 'قريباً'}
      </p>
    </div>
  );
}

function CompactLoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-8 w-28 mb-2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

function transformApiDataToGoldDataItem(
  key: string,
  data: GoldOverviewItem | GoldOunceItem
): GoldDataItem {
  const keyMap: Record<string, { id: string; nameKey: GoldDataItem['nameKey']; karat: string }> = {
    '21': { id: 'k21', nameKey: 'karat21', karat: 'k21' },
    '24': { id: 'k24', nameKey: 'karat24', karat: 'k24' },
    '18': { id: 'k18', nameKey: 'karat18', karat: 'k18' },
    'gold_pound': { id: 'pound', nameKey: 'pound', karat: 'pound' },
    'ounce': { id: 'ounce', nameKey: 'ounce', karat: 'ounce' },
  };

  const mapping = keyMap[key];
  const isOunce = key === 'ounce';

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (!isOunce && 'spread_percent' in data) {
    if (data.spread_percent > 0) trend = 'up';
    else if (data.spread_percent < 0) trend = 'down';
  }

  const spread_egp = isOunce ? 0 : (data as GoldOverviewItem).spread_egp;
  const spread_percent = isOunce ? 0 : (data as GoldOverviewItem).spread_percent;

  return {
    id: mapping.id,
    nameKey: mapping.nameKey,
    karat: mapping.karat,
    sellPrice: data.sell_price,
    buyPrice: data.buy_price,
    change: spread_egp,
    changePercent: spread_percent,
    trend,
    currency: data.currency,
    recordedAt: data.recorded_at,
  };
}

export function CompactGoldPrices() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useGoldOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <CompactLoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">
              {t.errors?.fetchError || 'خطأ في تحميل البيانات'}
            </h3>
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : 'فشل في تحميل أسعار الذهب'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform API data
  const goldData: GoldDataItem[] = [];

  if (data.data?.gold) {
    Object.entries(data.data.gold).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'sell_price' in value) {
        goldData.push(transformApiDataToGoldDataItem(key, value));
      }
    });
  }

  // Find items by ID
  const findItem = (id: string) => goldData.find((item) => item.id === id);

  // Order: 21k, gold pound, 24k, 18k, ounce
  const orderedItems = [
    findItem('k21'),
    findItem('pound'),
    findItem('k24'),
    findItem('k18'),
    findItem('ounce'),
  ].filter(Boolean) as GoldDataItem[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {orderedItems.map((item) => (
        <CompactGoldCard key={item.id} item={item} t={t} />
      ))}
    </div>
  );
}
