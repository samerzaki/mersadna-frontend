import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import SettingsPage from './settings-client';

export const metadata: Metadata = buildMetadata('meSettings', { noindex: true });

export default function Page() {
  return <SettingsPage />;
}
