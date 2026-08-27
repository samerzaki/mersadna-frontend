'use client';

import { useLanguage } from '@/contexts/language-context';

export function GoldPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        {t.pages.gold.title}
      </h2>
    </div>
  );
}
