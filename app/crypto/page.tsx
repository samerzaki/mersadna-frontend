import { Suspense } from 'react';
import { CryptoPageServer, CryptoPageSkeleton } from './crypto-featured-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import { PageHeader } from '@/components/ui/page-header';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildMetadata('crypto', { canonicalPath: '/crypto' });
export const revalidate = 60;

export default function CryptoPage() {
  return (
    <AutoRefreshWrapper>
      <PageHeader
        eyebrow="بيانات السوق العالمية"
        title="أسعار العملات الرقمية"
        lead="تابع أهم العملات الرقمية ومؤشرات الحركة السوقية، مع التنبيه إلى أن الأسعار مرجعية وليست توصية استثمارية."
      />
      <Suspense fallback={<CryptoPageSkeleton />}>
        <CryptoPageServer />
      </Suspense>
    </AutoRefreshWrapper>
  );
}
