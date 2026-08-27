'use client';

import { useState } from 'react';
import { PriceChart } from '@/components/charts/price-chart';
import { ChartControls } from '@/components/charts/chart-controls';
import { useChartData } from '@/hooks/use-price-history';
import { TimeRange, KaratCode } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
  'all': 730, // 2 years for "all"
};

export default function ChartPage() {
  const { t } = useLanguage();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('7d');
  const [activeKarats, setActiveKarats] = useState<KaratCode[]>(['k24', 'k21', 'k18']);

  const days = TIME_RANGE_DAYS[selectedRange];
  const { data, isLoading, error } = useChartData(days, activeKarats);

  const handleKaratToggle = (karat: KaratCode) => {
    setActiveKarats((prev) => {
      if (prev.includes(karat)) {
        // Don't allow removing all karats
        if (prev.length === 1) return prev;
        return prev.filter((k) => k !== karat);
      }
      return [...prev, karat];
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.pages.chart.title}</h1>
        <p className="text-muted-foreground">
          {t.pages.chart.subtitle}
        </p>
      </div>

      <ChartControls
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        activeKarats={activeKarats}
        onKaratToggle={handleKaratToggle}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{t.pages.chart.errorLoading}</p>
        </div>
      )}

      {data && !isLoading && (
        <PriceChart data={data} activeKarats={activeKarats} />
      )}
    </div>
  );
}
