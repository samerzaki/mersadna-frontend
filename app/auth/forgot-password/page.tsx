import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import ForgotPasswordPage from './forgot-password-client';

export const metadata: Metadata = buildMetadata('authForgotPassword', { noindex: true });

export default function Page() {
  return <ForgotPasswordPage />;
}
