import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import DisclaimerPage from './disclaimer-client';

export const metadata: Metadata = buildMetadata('terms', {
  canonicalPath: '/disclaimer',
  overrides: {
    title: 'إخلاء المسؤولية | Odamak',
    description: 'إخلاء مسؤولية منصة قدامك.',
  },
});

export default function Page() {
  return <DisclaimerPage />;
}
