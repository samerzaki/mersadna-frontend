import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import SilverPage from './silver-client';

export const metadata: Metadata = buildMetadata('silver', {
  canonicalPath: '/silver',
});

export default function Page() {
  return <SilverPage />;
}
