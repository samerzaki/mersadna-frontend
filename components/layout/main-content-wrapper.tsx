'use client';

import { useLanguage } from '@/contexts/language-context';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <main className={`flex-1 ${isRTL ? 'pr-64' : 'pl-64'}`}>
      <div className="container py-6">
        {children}
      </div>
    </main>
  );
}
