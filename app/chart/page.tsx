import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import ChartPage from './chart-client';

export const metadata: Metadata = buildMetadata('chart', {
  canonicalPath: '/chart',
});

export default function Page() {
  return <ChartPage />;
}
