import { HeroServer, HeroSkeleton } from '@/components/home/hero-server';
import { BestRatesWidgetServer, BestRatesWidgetSkeleton } from '@/components/home/best-rates-widget-server';
import { CryptoWidgetServer, CryptoWidgetSkeleton } from '@/components/home/crypto-widget-server';
import { SilverWidgetServer, SilverWidgetSkeleton } from '@/components/home/silver-widget-server';
import { HotNewsSectionServer, HotNewsSectionSkeleton } from '@/components/home/hot-news-server';
import { ToolTiles } from '@/components/home/tool-tiles';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildMetadata('home', { canonicalPath: '/' });
export const revalidate = 60;

export default function Home() {
  return (
    <AutoRefreshWrapper>
      <div className="space-y-10 md:space-y-14">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroServer />
        </Suspense>

        <Suspense fallback={<BestRatesWidgetSkeleton />}>
          <BestRatesWidgetServer />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<SilverWidgetSkeleton />}>
            <SilverWidgetServer />
          </Suspense>
          <Suspense fallback={<CryptoWidgetSkeleton />}>
            <CryptoWidgetServer />
          </Suspense>
        </div>

        <ToolTiles />

        <Suspense fallback={<HotNewsSectionSkeleton />}>
          <HotNewsSectionServer />
        </Suspense>
      </div>
    </AutoRefreshWrapper>
  );
}
