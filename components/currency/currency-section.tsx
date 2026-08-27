'use client';

import { CurrencyTable } from './currency-table';
import { CurrencyCard } from './currency-card';
import { useCurrencyPrices } from '@/hooks/use-currency-prices';
import { Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function CurrencySection() {
  const { data: currencies, isLoading, error } = useCurrencyPrices();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p>{t.currency.errorLoading}</p>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle for mobile */}
      <div className="md:hidden flex justify-end mb-4">
        <div className="flex gap-1 border border-border rounded-md p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'table' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            {t.currency.table}
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'cards' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            {t.currency.cards}
          </button>
        </div>
      </div>

      {/* Desktop: Always show table */}
      <div className="hidden md:block">
        <CurrencyTable currencies={currencies || []} />
      </div>
      
      {/* Mobile: Toggle between table and cards */}
      <div className="md:hidden">
        {viewMode === 'table' ? (
          <CurrencyTable currencies={currencies || []} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currencies?.map((currency) => (
              <CurrencyCard key={currency.code} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
