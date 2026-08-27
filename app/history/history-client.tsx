'use client';

import { useState } from 'react';
import { useGoldHistory } from '@/hooks/use-gold-prices';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { GoldHistoryChart } from '@/components/history/gold-history-chart';
import { LastUpdateIndicator } from '@/components/ui/last-update-indicator';

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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">تاريخ أسعار الذهب</h1>
          <p className="text-muted-foreground">
            عرض تاريخي لأسعار الذهب بجميع العيارات
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-yellow-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">خطأ في تحميل البيانات</h3>
              <p className="text-sm text-red-700">
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
              color="#FFD700"
              usdRates={data.data.usd_rates}
            />
            <GoldHistoryChart
              title="عيار 21 قيراط"
              data={data.data.karat_21}
              color="#FFA500"
              usdRates={data.data.usd_rates}
            />
            <GoldHistoryChart
              title="عيار 18 قيراط"
              data={data.data.karat_18}
              color="#FF8C00"
              usdRates={data.data.usd_rates}
            />
          </div>
        </div>
      )}
    </div>
  );
}
