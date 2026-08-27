'use client';

import { useEffect } from 'react';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
          <div className="mx-auto max-w-lg text-center">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-orange-100 p-6">
                <AlertTriangle className="h-12 w-12 text-orange-600" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-2xl font-semibold text-slate-800 md:text-3xl">
              حدث خطأ خطير
            </h2>

            {/* Description */}
            <p className="mb-8 text-base leading-relaxed text-slate-600">
              نعتذر، حدث خطأ خطير في التطبيق. يرجى تحديث الصفحة أو العودة للصفحة الرئيسية.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 rounded-md bg-slate-100 p-4 text-start">
                <p className="text-xs font-mono text-slate-600">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-slate-500">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                العودة للرئيسية
              </a>
            </div>

            {/* Help Text */}
            <p className="mt-8 text-sm text-slate-500">
              إذا استمرت المشكلة،{' '}
              <a href="/contact" className="text-slate-700 underline">
                تواصل معنا
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
