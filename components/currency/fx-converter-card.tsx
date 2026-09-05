'use client';

import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SectionCard } from '@/components/ui/section-card';
import { TogglePair } from '@/components/ui/toggle-pair';
import { useCurrencyAverages } from '@/hooks/use-currency-prices';
import { useLanguage } from '@/contexts/language-context';
import { CURRENCIES, type CurrencyCode } from '@/lib/mock-currency-data';

type ConverterCurrency = CurrencyCode | 'EGP';

interface FxConverterCardProps {
  fromCurrency?: CurrencyCode;
}

export function FxConverterCard({ fromCurrency: activeCurrency }: FxConverterCardProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState<ConverterCurrency>('USD');
  const [toCurrency, setToCurrency] = useState<ConverterCurrency>('EGP');
  const [source, setSource] = useState<'bank' | 'parallel'>('bank');

  useEffect(() => {
    if (activeCurrency) setFromCurrency(activeCurrency);
  }, [activeCurrency]);

  // Rates are stored relative to EGP. Fetching both sides lets us derive a
  // cross-currency rate while continuing to use the available market data.
  const { data: fromData, isLoading: isFromLoading } = useCurrencyAverages(
    fromCurrency,
    'EGP',
    fromCurrency !== 'EGP'
  );
  const { data: toData, isLoading: isToLoading } = useCurrencyAverages(
    toCurrency,
    'EGP',
    toCurrency !== 'EGP'
  );
  const isLoading = isFromLoading || isToLoading;

  const rate = useMemo(() => {
    if (fromCurrency === toCurrency) return 1;

    const rateFor = (currency: ConverterCurrency, data: typeof fromData) => {
      if (currency === 'EGP') return 1;
      return source === 'bank'
        ? data?.data?.banks?.avg_sell_rate ?? null
        : data?.data?.parallel_market?.avg_sell_rate ?? null;
    };

    const fromRate = rateFor(fromCurrency, fromData);
    const toRate = rateFor(toCurrency, toData);
    return fromRate !== null && toRate !== null && toRate > 0 ? fromRate / toRate : null;
  }, [fromCurrency, fromData, source, toCurrency, toData]);

  const numericAmount = parseFloat(amount) || 0;
  const result = rate ? numericAmount * rate : null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const selectFromCurrency = (nextCurrency: ConverterCurrency) => {
    if (nextCurrency === toCurrency) setToCurrency(fromCurrency);
    setFromCurrency(nextCurrency);
  };

  const selectToCurrency = (nextCurrency: ConverterCurrency) => {
    if (nextCurrency === fromCurrency) setFromCurrency(toCurrency);
    setToCurrency(nextCurrency);
  };

  return (
    <SectionCard title={t.currency.converterTitle} padded>
      <div className="space-y-4">
        <div>
          <label className="block text-[12px] text-muted mb-1.5">{t.currency.amountLabel}</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            className="w-full h-12 px-3.5 rounded-[11px] border border-line bg-bg num text-[18px] text-text focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <div>
            <label className="block text-[12px] text-muted mb-1.5">{t.currency.from}</label>
          <select
            value={fromCurrency}
            onChange={(e) => selectFromCurrency(e.target.value as ConverterCurrency)}
            className="w-full h-11 px-3.5 rounded-[11px] border border-line bg-bg text-[14px] text-text focus:border-gold focus:outline-none"
          >
            <option value="EGP">EGP</option>
            {CURRENCIES.filter((c) => c !== toCurrency).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          </div>
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap currencies"
            className="h-11 w-11 inline-flex items-center justify-center rounded-[11px] border border-line bg-panel2 text-muted hover:text-gold hover:border-gold-line transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <div>
            <label className="block text-[12px] text-muted mb-1.5">{t.currency.to}</label>
            <select
              value={toCurrency}
              onChange={(e) => selectToCurrency(e.target.value as ConverterCurrency)}
              className="w-full h-11 px-3.5 rounded-[11px] border border-line bg-bg text-[14px] text-text focus:border-gold focus:outline-none"
            >
              <option value="EGP">EGP</option>
              {CURRENCIES.filter((c) => c !== fromCurrency).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] text-muted mb-1.5">{t.currency.sourceLabel}</label>
          <TogglePair
            options={[
              { value: 'bank', label: t.currency.bankSource },
              { value: 'parallel', label: t.currency.parallelSource },
            ]}
            value={source}
            onChange={(v) => setSource(v as 'bank' | 'parallel')}
          />
        </div>

        <div className="pt-4 border-t border-[var(--line2)]">
          <div className="text-[12px] text-muted mb-1.5">{t.currency.estimatedResult}</div>
          {isLoading ? (
            <div className="num text-[24px] text-dim">—</div>
          ) : (
            <div className="num text-[32px] font-medium text-gold leading-none">
              {result !== null ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}
              <span className="text-[15px] text-muted font-normal"> {toCurrency}</span>
            </div>
          )}
          {rate !== null && (
            <div className="num text-[12.5px] text-dim mt-2">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
