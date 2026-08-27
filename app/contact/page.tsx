import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import ContactPage from './contact-client';

export const metadata: Metadata = buildMetadata('contact', {
  canonicalPath: '/contact',
});

export default function Page() {
  return <ContactPage />;
}
