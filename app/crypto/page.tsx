import { Suspense } from 'react';
import { CryptoPageServer, CryptoPageSkeleton } from './crypto-featured-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'العملات الرقمية',
  description: 'تابع أسعار العملات الرقمية الحية بما فيها البيتكوين والإيثيريوم. تحديثات فورية وبيانات السوق.',
};

export default function CryptoPage() {
  return (
    <AutoRefreshWrapper>
      <Suspense fallback={<CryptoPageSkeleton />}>
        <CryptoPageServer />
      </Suspense>
    </AutoRefreshWrapper>
  );
}
