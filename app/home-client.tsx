'use client';

import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import { Calculator, Bell } from 'lucide-react';

export default function HomeClient() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="md:sticky md:top-27.5 md:z-40 md:bg-background/95 md:backdrop-blur md:supports-backdrop-filter:bg-background/60 md:border-b md:border-border/40 md:-mx-8 md:px-8 md:py-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Clickable Section Title */}
        <Link
          href="/gold"
          className="group"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 transition-colors group-hover:text-primary">
            {t.home.goldPricesTitle}
          </h2>
        </Link>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Calculator className="h-4 w-4" />
            <span>{isRTL ? 'احسب المصنعية' : 'Calculate Profit'}</span>
          </Link>
          <Link
            href="/me/alerts"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span>{isRTL ? 'نبهني على سعر' : 'Price Alert'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
