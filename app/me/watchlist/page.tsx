import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import WatchlistPage from './watchlist-client';

export const metadata: Metadata = buildMetadata('meWatchlist', { noindex: true });

export default function Page() {
  return <WatchlistPage />;
}
