import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import ResetPasswordPage from './reset-password-client';

export const metadata: Metadata = buildMetadata('authResetPassword', { noindex: true });

export default function Page() {
  return <ResetPasswordPage />;
}
