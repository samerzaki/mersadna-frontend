import { ModernGoldPricesServer, ModernGoldPricesSkeleton } from '@/components/dashboard/modern-gold-prices-server';
import { UnifiedGoldChartServer } from '@/components/charts/unified-gold-chart-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import { GoldPageHeader } from './gold-page-header';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أسعار الذهب',
  description: 'تابع أسعار الذهب الحية في مصر بالجنيه المصري لجميع العيارات مع رسوم بيانية تفاعلية.',
};

export default function GoldPricesPage() {
  return (
    <AutoRefreshWrapper>
      <div className="space-y-8">
        {/* Header */}
        <section>
          <GoldPageHeader />
          <Suspense fallback={<ModernGoldPricesSkeleton />}>
            <ModernGoldPricesServer />
          </Suspense>
        </section>

        {/* Price History Chart */}
        <UnifiedGoldChartServer />
      </div>
    </AutoRefreshWrapper>
  );
}
