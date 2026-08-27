'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { PriceAlertModal } from '@/components/dashboard/price-alert-modal';
import { formatPriceWithCurrency } from '@/lib/format';
import { SilverDataItem, getSilverName } from './silver-data-utils';

function TrendIndicator({ trend, changePercent }: { trend: 'up' | 'down' | 'neutral'; changePercent: number }) {
  if (trend === 'neutral' || changePercent === 0) {
    return (
      <div className="flex items-center gap-1">
        <Minus className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-xs font-medium text-slate-400 tabular-nums">0%</span>
      </div>
    );
  }

  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <TrendIcon className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold tabular-nums">
        {Math.abs(changePercent).toFixed(2)}%
      </span>
    </div>
  );
}

function SilverCard({ item }: { item: SilverDataItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const locale = language === 'en' ? 'en-US' : 'ar-EG';
  const displayName = getSilverName(item.nameKey, isRTL);

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {displayName}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          </div>
        </div>

        {/* Price + Change */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
            </p>
          </div>
          <TrendIndicator trend={item.trend} changePercent={item.changePercent} />
        </div>

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
        goldType={displayName}
        currentPrice={item.sellPrice}
        currency={item.currency}
      />
    </>
  );
}

interface SilverWidgetClientProps {
  silverItems: SilverDataItem[];
}

export function SilverWidgetClient({ silverItems }: SilverWidgetClientProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <section className="flex flex-col w-full">
      {/* Section Header */}
      <div className="mb-4">
        <Link href="/silver" className="group">
          <h2 className="text-2xl font-bold flex items-center gap-2 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
            <Sparkles className="h-6 w-6 text-slate-500" />
            {isRTL ? 'أسعار الفضة' : 'Silver Prices'}
          </h2>
        </Link>
      </div>

      {/* Silver Cards - 4 cards for homepage */}
      <div className="grid grid-cols-2 gap-3 flex-1 content-start">
        {silverItems.map((item) => (
          <SilverCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
