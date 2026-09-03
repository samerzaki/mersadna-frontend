'use client';

import { useMemo, useState } from 'react';
import { SectionCard } from '@/components/ui/section-card';
import { TogglePair } from '@/components/ui/toggle-pair';
import { useCurrencyAverages } from '@/hooks/use-currency-prices';
import { useLanguage } from '@/contexts/language-context';
import { CURRENCIES, type CurrencyCode } from '@/lib/mock-currency-data';

export function FxConverterCard() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('1000');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [source, setSource] = useState<'bank' | 'parallel'>('bank');

  const { data: avgData, isLoading } = useCurrencyAverages(currency, 'EGP');

  const currencyNames: Record<CurrencyCode, string> = {
    USD: t.currency.usdName,
    EUR: t.currency.eurName,
    SAR: t.currency.sarName,
    AED: t.currency.aedName,
    KWD: t.currency.kwdName,
    GBP: t.currency.gbpName,
  };

  const rate = useMemo(() => {
    if (source === 'bank') return avgData?.data?.banks?.avg_sell_rate ?? null;
    return avgData?.data?.parallel_market?.avg_sell_rate ?? null;
  }, [avgData, source]);

  const numericAmount = parseFloat(amount) || 0;
  const result = rate ? numericAmount * rate : null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
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

        <div>
          <label className="block text-[12px] text-muted mb-1.5">{t.currency.currencyName}</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="w-full h-11 px-3.5 rounded-[11px] border border-line bg-bg text-[14px] text-text focus:border-gold focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {currencyNames[c]} ({c})
              </option>
            ))}
          </select>
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
              <span className="text-[15px] text-muted font-normal"> {t.common.egp}</span>
            </div>
          )}
          {rate !== null && (
            <div className="num text-[12.5px] text-dim mt-2">
              1 {currency} = {rate.toFixed(2)} {t.common.egp}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
