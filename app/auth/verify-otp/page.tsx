import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import VerifyOTPPage from './verify-otp-client';

export const metadata: Metadata = buildMetadata('authVerifyOtp', { noindex: true });

export default function Page() {
  return <VerifyOTPPage />;
}
