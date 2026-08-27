import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import RegisterPage from './register-client';

export const metadata: Metadata = buildMetadata('authRegister', { noindex: true });

export default function Page() {
  return <RegisterPage />;
}
