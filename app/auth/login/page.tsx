import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import LoginPage from './login-client';

export const metadata: Metadata = buildMetadata('authLogin', { noindex: true });

export default function Page() {
  return <LoginPage />;
}
