import { CompactGoldPricesServer, CompactGoldPricesSkeleton } from '@/components/dashboard/compact-gold-prices-server';
import { BestRatesWidgetServer, BestRatesWidgetSkeleton } from '@/components/home/best-rates-widget-server';
import { CryptoWidgetServer, CryptoWidgetSkeleton } from '@/components/home/crypto-widget-server';
import { SilverWidgetServer, SilverWidgetSkeleton } from '@/components/home/silver-widget-server';
import { HotNewsSectionServer, HotNewsSectionSkeleton } from '@/components/home/hot-news-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import type { Metadata } from 'next';
import HomeClient from './home-client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'الرئيسية',
  description: 'أحدث أسعار الذهب في مصر بالجنيه المصري لجميع العيارات. تابع تحركات السوق اليومية واحصل على أفضل الأسعار المحدثة لحظياً.',
  keywords: ['أسعار الذهب اليوم', 'سعر الذهب المصري', 'ذهب عيار 21', 'ذهب عيار 24', 'أسعار الذهب الحية', 'متابعة الذهب'],
  openGraph: {
    title: 'الرئيسية | Mersadna - أسعار الذهب في مصر',
    description: 'أحدث أسعار الذهب في مصر بالجنيه المصري لجميع العيارات. تابع تحركات السوق اليومية واحصل على أفضل الأسعار المحدثة لحظياً.',
  },
};

export default function Home() {
  return (
    <AutoRefreshWrapper>
      <div className="space-y-8">
        {/* Gold Prices Section */}
        <section>
          <HomeClient />
          <Suspense fallback={<CompactGoldPricesSkeleton />}>
            <CompactGoldPricesServer />
          </Suspense>
        </section>

        {/* Currencies, Crypto & Silver */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-8">
          <div className="lg:w-[40%] flex">
            <Suspense fallback={<BestRatesWidgetSkeleton />}>
              <BestRatesWidgetServer />
            </Suspense>
          </div>
          <div className="lg:w-[25%] flex">
            <Suspense fallback={<CryptoWidgetSkeleton />}>
              <CryptoWidgetServer />
            </Suspense>
          </div>
          <div className="lg:w-[35%] flex">
            <Suspense fallback={<SilverWidgetSkeleton />}>
              <SilverWidgetServer />
            </Suspense>
          </div>
        </div>

        {/* Hot News Section */}
        <Suspense fallback={<HotNewsSectionSkeleton />}>
          <HotNewsSectionServer />
        </Suspense>
      </div>
    </AutoRefreshWrapper>
  );
}
