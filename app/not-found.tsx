'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function NotFound() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <div className="mx-auto max-w-lg text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-slate-300 dark:text-slate-700 md:text-9xl">
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-slate-100 md:text-3xl">
          {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>

        {/* Description */}
        <p className="mb-8 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {isRTL
            ? 'عذراً، الصفحة التي تبحث عنها غير متوفرة. قد تكون قد تم نقلها أو حذفها.'
            : 'Sorry, the page you are looking for is not available. It may have been moved or deleted.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Home className="h-4 w-4" />
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>

          <Link
            href="/gold"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Search className="h-4 w-4" />
            {isRTL ? 'استكشف الأسعار' : 'Explore Prices'}
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
          {isRTL ? (
            <>
              هل تحتاج إلى مساعدة؟{' '}
              <Link href="/contact" className="text-slate-700 underline dark:text-slate-300">
                تواصل معنا
              </Link>
            </>
          ) : (
            <>
              Need help?{' '}
              <Link href="/contact" className="text-slate-700 underline dark:text-slate-300">
                Contact us
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
