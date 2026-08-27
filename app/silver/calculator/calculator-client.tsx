'use client';

import { Calculator, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function SilverCalculatorPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="max-w-4xl space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Calculator className="h-8 w-8" />
            {isRTL ? 'حاسبة الفضة' : 'Silver Calculator'}
          </h1>
        </section>

        {/* Placeholder Content */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Sparkles className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {isRTL ? 'قريباً' : 'Coming Soon'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              {isRTL 
                ? 'نعمل على توفير حاسبة الفضة قريباً' 
                : 'We are working on bringing you the silver calculator soon'
              }
            </p>
          </div>
        </div>
    </div>
  );
}
