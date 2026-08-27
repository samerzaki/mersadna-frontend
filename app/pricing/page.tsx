import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import PricingPage from './pricing-client';

export const metadata: Metadata = buildMetadata('pricing', {
  canonicalPath: '/pricing',
});

export default function Page() {
  return <PricingPage />;
}
