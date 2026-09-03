'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useGoldHistory } from '@/hooks/use-gold-prices';
import { UnifiedGoldChart } from './unified-gold-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionCard } from '@/components/ui/section-card';
import { useLanguage } from '@/contexts/language-context';

type GoldPeriod = '24h' | '7d' | '30d' | '1y' | 'all';

export function UnifiedGoldChartServer() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<GoldPeriod>('30d');
  const { data: historyData, isLoading, isFetching, error } = useGoldHistory(period, 'EGP', true);

  // First load only — show full skeleton
  if (isLoading && !historyData) {
    return <UnifiedGoldChartSkeleton />;
  }

  if (error && !historyData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300">
              {t.charts.errorLoadingTitle}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {error instanceof Error ? error.message : t.charts.errorLoadingChartMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!historyData?.data) {
    return null;
  }

  return (
    <SectionCard padded>
      <UnifiedGoldChart
        data={historyData.data}
        period={period}
        onPeriodChange={setPeriod}
        isLoading={isFetching}
      />
    </SectionCard>
  );
}

export function UnifiedGoldChartSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
