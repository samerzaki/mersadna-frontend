'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface NewsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function NewsSearch({ value, onChange, placeholder, className }: NewsSearchProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className={cn('relative', className)}>
      <Search className={cn(
        'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400',
        isRTL ? 'right-3' : 'left-3'
      )} />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || (isRTL ? 'ابحث في الأخبار...' : 'Search news...')}
        className={cn(
          'w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
          'text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all',
          isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 p-1 rounded-full',
            'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
            'hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
            isRTL ? 'left-2' : 'right-2'
          )}
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
