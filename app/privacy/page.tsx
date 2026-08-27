import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import PrivacyPage from './privacy-client';

export const metadata: Metadata = buildMetadata('privacy', {
  canonicalPath: '/privacy',
});

export default function Page() {
  return <PrivacyPage />;
}
