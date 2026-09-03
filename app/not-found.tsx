'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="card-surface mx-auto max-w-lg p-8 text-center md:p-10">
        <h1 className="num mb-6 text-[64px] font-bold leading-none text-gold md:text-[80px]">404</h1>

        <h2 className="mb-4 font-heading text-2xl font-semibold text-text md:text-3xl">
          {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>

        <p className="mb-8 text-base leading-relaxed text-muted">
          {isRTL
            ? 'عذراً، الصفحة التي تبحث عنها غير متوفرة. قد تكون قد تم نقلها أو حذفها.'
            : 'Sorry, the page you are looking for is not available. It may have been moved or deleted.'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/gold">
              <Search className="h-4 w-4" />
              {isRTL ? 'استكشف الأسعار' : 'Explore Prices'}
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-dim">
          {isRTL ? (
            <>
              هل تحتاج إلى مساعدة؟{' '}
              <Link href="/contact" className="text-gold underline">
                تواصل معنا
              </Link>
            </>
          ) : (
            <>
              Need help?{' '}
              <Link href="/contact" className="text-gold underline">
                Contact us
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
