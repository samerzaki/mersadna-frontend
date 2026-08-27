import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import TermsPage from './terms-client';

export const metadata: Metadata = buildMetadata('terms', {
  canonicalPath: '/terms',
});

export default function Page() {
  return <TermsPage />;
}
