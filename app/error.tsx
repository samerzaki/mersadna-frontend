'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <div className="mx-auto max-w-lg text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-950/30">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100 md:text-3xl">
          {isRTL ? 'حدث خطأ ما' : 'Something Went Wrong'}
        </h2>

        {/* Description */}
        <p className="mb-8 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {isRTL
            ? 'نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
            : 'We apologize, an unexpected error occurred. Please try again.'}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 rounded-md bg-slate-100 p-4 text-start dark:bg-slate-800">
            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <RefreshCw className="h-4 w-4" />
            {isRTL ? 'إعادة المحاولة' : 'Try Again'}
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Home className="h-4 w-4" />
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
          {isRTL ? (
            <>
              إذا استمرت المشكلة،{' '}
              <Link href="/contact" className="text-slate-700 underline dark:text-slate-300">
                تواصل معنا
              </Link>
            </>
          ) : (
            <>
              If the problem persists,{' '}
              <Link href="/contact" className="text-slate-700 underline dark:text-slate-300">
                contact us
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
