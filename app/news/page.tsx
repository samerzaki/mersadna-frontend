import { Metadata } from 'next';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo-config';
import NewsPage from './news-client';

export const metadata: Metadata = buildMetadata('news', {
  canonicalPath: '/news',
});

export default function Page() {
  return <Suspense fallback={null}><NewsPage /></Suspense>;
}
