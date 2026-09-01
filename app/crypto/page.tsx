import { Suspense } from 'react';
import { CryptoPageServer, CryptoPageSkeleton } from './crypto-featured-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildMetadata('crypto', { canonicalPath: '/crypto' });
export const revalidate = 60;

export default function CryptoPage() {
  return (
    <AutoRefreshWrapper>
      <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
        <p className="mb-2 text-sm font-semibold text-primary">بيانات السوق العالمية</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">أسعار العملات الرقمية</h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">تابع أهم العملات الرقمية ومؤشرات الحركة السوقية، مع التنبيه إلى أن الأسعار مرجعية وليست توصية استثمارية.</p>
      </header>
      <Suspense fallback={<CryptoPageSkeleton />}>
        <CryptoPageServer />
      </Suspense>
    </AutoRefreshWrapper>
  );
}
