import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import AlertsPage from './alerts-client';

export const metadata: Metadata = buildMetadata('meAlerts', { noindex: true });

export default function Page() {
  return <AlertsPage />;
}
