'use client';

import { useLanguage } from "@/contexts/language-context";

export default function CurrenciesClient() {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        
        <span>💱</span>
        {t.pages.currencies.title}
        
      </h2>
    </div>
  );
}
