'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function HtmlDirection() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update HTML attributes after hydration to avoid mismatch
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
