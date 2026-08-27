import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import PortfolioPage from './portfolio-client';

export const metadata: Metadata = buildMetadata('mePortfolio', { noindex: true });

export default function Page() {
  return <PortfolioPage />;
}
