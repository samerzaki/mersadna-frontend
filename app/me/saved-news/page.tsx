import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import SavedNewsPage from './saved-news-client';

export const metadata: Metadata = buildMetadata('meSavedNews', { noindex: true });

export default function Page() {
  return <SavedNewsPage />;
}
