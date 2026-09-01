import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import NewsDetailPage from './news-detail-client';

// Article data is fetched by the client directly from the configured backend URL.
export const metadata: Metadata = buildMetadata('news', {
  canonicalPath: '/news',
});

export default function Page() {
  return <NewsDetailPage />;
}
