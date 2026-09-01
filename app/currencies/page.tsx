import React, { Suspense } from "react";
import { UnifiedDashboardServer, UnifiedDashboardSkeleton } from "@/components/currency/unified-dashboard-server";
import { AutoRefreshWrapper } from "@/components/dashboard/auto-refresh-wrapper";
import type { Metadata } from "next";
import CurrenciesClient from "./currencies-client";
import { buildMetadata } from '@/lib/seo-config';
import { MarketGuidance } from '@/components/seo/market-guidance';

export const metadata: Metadata = buildMetadata('currencies', { canonicalPath: '/currencies' });
export const revalidate = 60;

export default function CurrenciesPage() {
  return (
    <AutoRefreshWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
          <p className="mb-2 text-sm font-semibold text-primary">البنوك والأسعار المرجعية</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">أسعار العملات اليوم في مصر</h1>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">قارن أسعار العملات المتاحة، وراجع وقت آخر تحديث قبل إجراء أي معاملة.</p>
        </header>
        <section className="mb-6">
          <CurrenciesClient />
        </section>
        <Suspense fallback={<UnifiedDashboardSkeleton />}>
          <UnifiedDashboardServer />
        </Suspense>
        <div className="mt-8">
          <MarketGuidance
            title="قبل تحويل العملات"
            intro="قارن بين أكثر من سعر عند توفره، وراجع وقت التحديث وشروط البنك أو مزود الخدمة قبل تنفيذ التحويل."
            points={[
              'فرق الشراء والبيع قد يختلف بين البنوك والفروع.',
              'الأسعار المعروضة مرجعية ولا تغني عن التأكيد من الجهة المنفذة.',
              'استخدم الحاسبة لتقدير المبلغ قبل الذهاب إلى البنك أو شركة الصرافة.',
            ]}
            questions={[
              { question: 'هل سعر التحويل في الحاسبة ملزم؟', answer: 'لا، هو تقدير مبني على البيانات المتاحة؛ السعر النهائي تحدده الجهة المنفذة.' },
              { question: 'ما الفرق بين سعر الشراء وسعر البيع؟', answer: 'سعر الشراء هو ما تدفعه الجهة لشراء العملة، وسعر البيع هو ما تطلبه لبيعها لك.' },
            ]}
          />
        </div>
      </div>
    </AutoRefreshWrapper>
  );
}
