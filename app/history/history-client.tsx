'use client';

import { useState } from 'react';
import { useGoldHistory } from '@/hooks/use-gold-prices';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { GoldHistoryChart } from '@/components/history/gold-history-chart';
import { LastUpdateIndicator } from '@/components/ui/last-update-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { KARAT_COLORS } from '@/lib/constants';

type Period = '24h' | '7d' | '30d' | '1y';

export default function HistoryPage() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>('30d');
  const [currency] = useState('EGP');

  const { data, isLoading, error } = useGoldHistory(period, currency, true);

  const periods: { value: Period; label: string }[] = [
    { value: '24h', label: '24 ساعة' },
    { value: '7d', label: '7 أيام' },
    { value: '30d', label: '30 يوم' },
    { value: '1y', label: 'سنة' },
  ];

  return (
    <div className="container mx-auto px-4 space-y-6">
      <PageHeader
        title="تاريخ أسعار الذهب"
        lead="عرض تاريخي لأسعار الذهب بجميع العيارات"
        actions={
          <SegmentedControl
            items={periods}
            value={period}
            onChange={(v) => setPeriod(v as Period)}
          />
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      )}

      {error && (
        <div className="bg-down-soft border border-line rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-down" />
            <div>
              <h3 className="font-semibold text-text">خطأ في تحميل البيانات</h3>
              <p className="text-sm text-down">
                {error instanceof Error ? error.message : 'فشل في تحميل تاريخ أسعار الذهب'}
              </p>
            </div>
          </div>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-6">
          {/* Last Update Indicator */}
          <div className="flex justify-end">
            <LastUpdateIndicator
              recordedAt={data.data.karat_24.recorded_at}
              showFullDate={true}
            />
          </div>

          {/* Gold History Charts */}
          <div className="grid gap-6">
            <GoldHistoryChart
              title="عيار 24 قيراط"
              data={data.data.karat_24}
              color={KARAT_COLORS.k24}
              usdRates={data.data.usd_rates}
            />
            <GoldHistoryChart
              title="عيار 21 قيراط"
              data={data.data.karat_21}
              color={KARAT_COLORS.k21}
              usdRates={data.data.usd_rates}
            />
            <GoldHistoryChart
              title="عيار 18 قيراط"
              data={data.data.karat_18}
              color={KARAT_COLORS.k18}
              usdRates={data.data.usd_rates}
            />
          </div>
        </div>
      )}
    </div>
  );
}
