'use client';

import { use } from 'react';
import { useKaratPrice } from '@/hooks/use-gold-prices';
import { useChartData } from '@/hooks/use-price-history';
import { PriceChart } from '@/components/charts/price-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendIndicator } from '@/components/dashboard/trend-indicator';
import { Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPriceChange, formatPercent, formatRelativeTime } from '@/lib/format';
import { KaratCode } from '@/types';
import { KARATS } from '@/lib/constants';
import { useLanguage } from '@/contexts/language-context';

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
        <p className="text-destructive">{t.pages.karat.invalidKarat}</p>
      </div>
    );
  }

  if (priceLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (priceError || !price) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-destructive">
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{karatInfo.name}</h1>
        <p className="text-muted-foreground">
          {t.pages.karat.purity} {(karatInfo.purity * 100).toFixed(1)}%
        </p>
      </div>

      {/* Main price card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.pages.karat.currentPrice}</CardTitle>
            <Badge variant={isPositive ? 'default' : 'destructive'} className="gap-1">
              <TrendIndicator change={price.change} showIcon={false} />
              {formatPercent(price.changePercent)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Buy price */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.pages.karat.buyPrice}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-bold">{formatPrice(price.buyPrice)}</p>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={`text-lg font-semibold ${
                      isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPriceChange(price.change)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sell price */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.pages.karat.sellPrice}</p>
              <p className="text-5xl font-bold text-muted-foreground">
                {formatPrice(price.sellPrice)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {t.pages.karat.lastUpdate}: {formatRelativeTime(price.updatedAt)}
          </p>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.pages.karat.high30d}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatPrice(stats.high)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.pages.karat.low30d}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatPrice(stats.low)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.pages.karat.avg30d}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatPrice(stats.average)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      {chartLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
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
