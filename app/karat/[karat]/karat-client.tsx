'use client';

import { use } from 'react';
import { useKaratPrice } from '@/hooks/use-gold-prices';
import { useChartData } from '@/hooks/use-price-history';
import { PriceChart } from '@/components/charts/price-chart';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { StatTile } from '@/components/ui/stat-tile';
import { ChangeChip } from '@/components/ui/change-badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatPrice, formatPriceChange, formatRelativeTime } from '@/lib/format';
import { KaratCode } from '@/types';
import { KARATS } from '@/lib/constants';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ karat: KaratCode }>;
}

export default function KaratPage({ params }: PageProps) {
  const { karat } = use(params);
  const karatInfo = KARATS.find((k) => k.code === karat);

  const { data: price, isLoading: priceLoading, error: priceError } = useKaratPrice(karat);
  const { data: chartData, isLoading: chartLoading } = useChartData(30, [karat]);

  const { t } = useLanguage();

  if (!karatInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-down">{t.pages.karat.invalidKarat}</p>
      </div>
    );
  }

  if (priceLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (priceError || !price) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-down">
        <AlertCircle className="h-5 w-5" />
        <p>{t.pages.karat.errorLoading}</p>
      </div>
    );
  }

  const isPositive = price.change >= 0;

  // Calculate statistics from chart data
  const stats = chartData
    ? {
        high: Math.max(...chartData.map((d) => d.buyPrice)),
        low: Math.min(...chartData.map((d) => d.buyPrice)),
        average:
          chartData.reduce((sum, d) => sum + d.buyPrice, 0) / chartData.length,
      }
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${t.pages.karat.purity} ${(karatInfo.purity * 100).toFixed(1)}%`}
        title={karatInfo.name}
      />

      {/* Main price card */}
      <SectionCard
        title={t.pages.karat.currentPrice}
        action={<ChangeChip value={price.changePercent} />}
        padded
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Buy price */}
          <div>
            <p className="text-sm text-muted mb-2">{t.pages.karat.buyPrice}</p>
            <div className="flex items-baseline gap-3">
              <p className="num text-5xl font-semibold text-text">{formatPrice(price.buyPrice)}</p>
              <span className={cn('num text-lg font-semibold', isPositive ? 'text-up' : 'text-down')}>
                {formatPriceChange(price.change)}
              </span>
            </div>
          </div>

          {/* Sell price */}
          <div>
            <p className="text-sm text-muted mb-2">{t.pages.karat.sellPrice}</p>
            <p className="num text-5xl font-semibold text-muted">
              {formatPrice(price.sellPrice)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          {t.pages.karat.lastUpdate}: {formatRelativeTime(price.updatedAt)}
        </p>
      </SectionCard>

      {/* Statistics */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile label={t.pages.karat.high30d} value={formatPrice(stats.high)} />
          <StatTile label={t.pages.karat.low30d} value={formatPrice(stats.low)} />
          <StatTile label={t.pages.karat.avg30d} value={formatPrice(stats.average)} />
        </div>
      )}

      {/* Chart */}
      {chartLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : chartData ? (
        <PriceChart
          data={chartData}
          activeKarats={[karat]}
          title={`${t.pages.karat.priceHistory} - ${karatInfo.name}`}
        />
      ) : null}
    </div>
  );
}
