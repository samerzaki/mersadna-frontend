'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="card-surface mx-auto max-w-lg p-8 text-center md:p-10">
        <div className="mb-6 flex justify-center">
          <AlertCircle className="num h-16 w-16 text-gold" />
        </div>

        <h2 className="mb-4 font-heading text-2xl font-semibold text-text md:text-3xl">
          {isRTL ? 'حدث خطأ ما' : 'Something Went Wrong'}
        </h2>

        <p className="mb-8 text-base leading-relaxed text-muted">
          {isRTL
            ? 'نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
            : 'We apologize, an unexpected error occurred. Please try again.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 rounded-[11px] border border-line bg-panel2 p-4 text-start">
            <p className="num text-xs text-muted">{error.message}</p>
            {error.digest && <p className="mt-2 text-xs text-dim">Error ID: {error.digest}</p>}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default" size="lg">
            <RefreshCw className="h-4 w-4" />
            {isRTL ? 'إعادة المحاولة' : 'Try Again'}
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-dim">
          {isRTL ? (
            <>
              إذا استمرت المشكلة،{' '}
              <Link href="/contact" className="text-gold underline">
                تواصل معنا
              </Link>
            </>
          ) : (
            <>
              If the problem persists,{' '}
              <Link href="/contact" className="text-gold underline">
                contact us
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
