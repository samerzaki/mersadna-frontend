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
  const { language, t } = useLanguage();
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
        'absolute top-1/2 -translate-y-1/2 w-4 h-4 text-dim',
        isRTL ? 'right-3.5' : 'left-3.5'
      )} />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || t.pages.news.searchPlaceholder}
        className={cn(
          'w-full h-11 rounded-[11px] border border-line bg-bg text-text',
          'text-[14px] placeholder:text-dim',
          'focus:outline-none focus:border-gold transition-colors',
          isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 p-1 rounded-full',
            'text-dim hover:text-text hover:bg-hover transition-colors',
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
