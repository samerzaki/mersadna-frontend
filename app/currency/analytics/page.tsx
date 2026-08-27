import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import CurrencyAnalyticsPage from './analytics-client';

export const metadata: Metadata = buildMetadata('currencyAnalytics', {
  canonicalPath: '/currency/analytics',
});

export default function Page() {
  return <CurrencyAnalyticsPage />;
}
