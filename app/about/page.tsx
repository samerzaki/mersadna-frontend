import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import AboutPage from './about-client';

export const metadata: Metadata = buildMetadata('about', {
  canonicalPath: '/about',
});

export default function Page() {
  return <AboutPage />;
}
