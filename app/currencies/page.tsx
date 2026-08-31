import React, { Suspense } from "react";
import { UnifiedDashboardServer, UnifiedDashboardSkeleton } from "@/components/currency/unified-dashboard-server";
import { AutoRefreshWrapper } from "@/components/dashboard/auto-refresh-wrapper";
import type { Metadata } from "next";
import CurrenciesClient from "./currencies-client";

export const metadata: Metadata = {
  title: 'أسعار العملات',
  description: 'تابع أسعار العملات الأجنبية في مصر بما فيها الدولار الأمريكي، اليورو، الجنيه الإسترليني والريال السعودي. تحديثات فورية من البنوك المصرية.',
  keywords: ['سعر الدولار في مصر', 'سعر اليورو', 'أسعار العملات', 'تحويل العملات', 'سعر الصرف', 'بنك مصر', 'البنك الأهلي'],
  openGraph: {
    title: 'أسعار العملات في مصر | Mersadna',
    description: 'تابع أسعار العملات الأجنبية في مصر بما فيها الدولار الأمريكي، اليورو، الجنيه الإسترليني والريال السعودي.',
  },
};

export default function CurrenciesPage() {
  return (
    <AutoRefreshWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <section className="mb-6">
          <CurrenciesClient />
        </section>
        <Suspense fallback={<UnifiedDashboardSkeleton />}>
          <UnifiedDashboardServer />
        </Suspense>
      </div>
    </AutoRefreshWrapper>
  );
}
