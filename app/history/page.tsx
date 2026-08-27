import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import HistoryPage from './history-client';

export const metadata: Metadata = buildMetadata('history', {
  canonicalPath: '/history',
});

export default function Page() {
  return <HistoryPage />;
}
