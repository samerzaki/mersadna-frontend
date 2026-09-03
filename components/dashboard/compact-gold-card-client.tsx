'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { PriceAlertModal } from './price-alert-modal';
import { GoldDataItem, getName, LiveIndicator, TrendIndicator } from './gold-card-utils';

interface CompactGoldCardProps {
  item: GoldDataItem;
}

const CHART_COLORS: Record<string, string> = {
  green: '#16a34a',
  red: '#dc2626',
  gray: '#94a3b8',
};

function GoldSparkline({ points, color }: { points: number[]; color: string }) {
  const values = points.filter(Number.isFinite);
  if (values.length < 2) return null;

  const width = 112;
  const height = 36;
  const padding = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stroke = CHART_COLORS[color.toLowerCase()] ?? CHART_COLORS.gray;
  const linePoints = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = padding + (height - padding * 2) - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      aria-label="Price trend chart"
      className="h-9 w-28 shrink-0"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
    >
      <polyline
        points={linePoints}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Client component for individual gold card
 * Handles interactive features (modal, hover effects)
 * Receives data as props from server component
 */
export function CompactGoldCard({ item }: CompactGoldCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, t } = useLanguage();
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
          <LiveIndicator
            recordedAt={item.lastCheckedAt}
            tooltip={item.lastCheckedAtForHuman}
            liveWithinMinutes={120}
          />
        </div>

        {/* Sell Price (Primary) */}
        <div className="mb-2">
          <p className="text-[11px] font-medium text-slate-500 dark:text-muted-foreground mb-0.5">{t.gold.sellPrice}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-foreground tabular-nums">
            {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
          </p>
        </div>

        {/* Historical prices supplied by get-overview.chart_points */}
        {!isOunce && (
          <div className="mb-3 flex justify-end" dir="ltr">
            <GoldSparkline points={item.chartPoints} color={item.chartColor} />
          </div>
        )}

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
          title="إنشاء تنبيه"
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
