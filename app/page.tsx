import { CompactGoldPricesServer, CompactGoldPricesSkeleton } from '@/components/dashboard/compact-gold-prices-server';
import { BestRatesWidgetServer, BestRatesWidgetSkeleton } from '@/components/home/best-rates-widget-server';
import { CryptoWidgetServer, CryptoWidgetSkeleton } from '@/components/home/crypto-widget-server';
import { SilverWidgetServer, SilverWidgetSkeleton } from '@/components/home/silver-widget-server';
import { HotNewsSectionServer, HotNewsSectionSkeleton } from '@/components/home/hot-news-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import type { Metadata } from 'next';
import HomeClient from './home-client';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo-config';
import { MarketGuidance } from '@/components/seo/market-guidance';

export const metadata: Metadata = buildMetadata('home', { canonicalPath: '/' });
export const revalidate = 60;

export default function Home() {
  return (
    <AutoRefreshWrapper>
      <div className="space-y-8">
        <header className="rounded-2xl border border-border/70 bg-card p-5 md:p-7">
          <p className="mb-2 text-sm font-semibold text-primary">مرصادنا للأسواق المصرية</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">أسعار الذهب والعملات في مصر</h1>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            تابع أحدث الأسعار المرجعية للذهب والعملات والفضة، واستخدم أدوات مرصادنا لفهم الحركة اليومية قبل اتخاذ قرارك.
          </p>
        </header>
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

        <MarketGuidance
          title="كيف تستخدم مرصادنا؟"
          intro="تساعدك مرصادنا على قراءة السعر المرجعي وحركته، ثم الانتقال إلى الأداة أو القسم المناسب قبل اتخاذ قرار الشراء أو البيع."
          points={[
            'راجع وقت آخر تحديث ووحدة القياس قبل مقارنة أي سعر.',
            'استخدم الحاسبة لتقدير قيمة الوزن والعيار والمصنعية.',
            'تأكد من السعر النهائي لدى التاجر أو البنك؛ قد تختلف الأسعار الفعلية.',
          ]}
          questions={[
            { question: 'هل الأسعار المعروضة هي السعر النهائي للشراء؟', answer: 'لا. الأسعار مرجعية وقد تختلف حسب المصنعية والضرائب وهامش التاجر أو الجهة المنفذة.' },
            { question: 'ما الذي أتابعه قبل شراء الذهب؟', answer: 'ابدأ بالعيار والوزن والسعر لكل جرام، ثم أضف المصنعية وأي رسوم قبل المقارنة.' },
          ]}
        />
      </div>
    </AutoRefreshWrapper>
  );
}
