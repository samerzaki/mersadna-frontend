'use client';

import { useEffect, useMemo, useState } from 'react';
import { SectionCard } from '@/components/ui/section-card';
import { TogglePair } from '@/components/ui/toggle-pair';
import { Input } from '@/components/ui/input';
import { useGoldOverview } from '@/hooks/use-gold-prices';
import { useSilverOverview } from '@/hooks/use-silver-prices';
import { WORKMANSHIP_RANGES } from '@/lib/constants';
import { formatNumber } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';

export type MetalType = 'g24' | 'g21' | 'g18' | 's999' | 's925';

const DEFAULT_WORKMANSHIP: Record<MetalType, number> = {
  g24: WORKMANSHIP_RANGES.karat24.default,
  g21: WORKMANSHIP_RANGES.karat21.default,
  g18: WORKMANSHIP_RANGES.karat18.default,
  s999: WORKMANSHIP_RANGES.silver999.default,
  s925: WORKMANSHIP_RANGES.silver925.default,
};

interface SimpleCalculatorProps {
  defaultType?: MetalType;
}

export function SimpleCalculator({ defaultType = 'g21' }: SimpleCalculatorProps) {
  const { t } = useLanguage();
  const { data: goldData, isLoading: goldLoading } = useGoldOverview();
  const { data: silverData, isLoading: silverLoading } = useSilverOverview();

  const TYPE_LABELS: Record<MetalType, string> = {
    g24: t.pages.calculator.goldKarat24Label,
    g21: t.pages.calculator.goldKarat21Label,
    g18: t.pages.calculator.goldKarat18Label,
    s999: t.pages.calculator.silver999Label,
    s925: t.pages.calculator.silver925Label,
  };

  const [weight, setWeight] = useState('');
  const [type, setType] = useState<MetalType>(defaultType);
  const [workmanship, setWorkmanship] = useState<string>(String(DEFAULT_WORKMANSHIP[defaultType]));
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  // Reset workmanship default when type changes
  useEffect(() => {
    setWorkmanship(String(DEFAULT_WORKMANSHIP[type]));
  }, [type]);

  const prices = useMemo(() => {
    const gold = goldData?.data?.gold;
    const silver = silverData?.data?.silver;
    const map: Record<MetalType, { buy: number; sell: number } | null> = {
      g24: gold?.['24'] ? gold['24'].price : null,
      g21: gold?.['21'] ? gold['21'].price : null,
      g18: gold?.['18'] ? gold['18'].price : null,
      s999: silver?.['999_egyptian'] ? silver['999_egyptian'].price : null,
      s925: silver?.['925'] ? silver['925'].price : null,
    };
    return map;
  }, [goldData, silverData]);

  const isLoading = goldLoading || silverLoading;

  const weightNum = parseFloat(weight) || 0;
  const workmanshipNum = parseFloat(workmanship) || 0;
  const priceEntry = prices[type];
  const basePrice = priceEntry ? (mode === 'buy' ? priceEntry.buy : priceEntry.sell) : 0;

  const baseTotal = weightNum * basePrice;
  const workmanshipTotal = mode === 'buy' ? weightNum * workmanshipNum : 0;
  const total = baseTotal + workmanshipTotal;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <SectionCard title={t.pages.calculator.simpleFormTitle} padded>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-muted mb-1.5">{t.pages.calculator.weightGramLabel}</label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-[12px] text-muted mb-1.5">{t.pages.calculator.typeKaratLabel}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MetalType)}
              className="w-full h-11 px-3.5 rounded-[11px] border border-line bg-bg text-[14px] text-text focus:border-gold focus:outline-none"
            >
              {(Object.keys(TYPE_LABELS) as MetalType[]).map((key) => (
                <option key={key} value={key}>
                  {TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] text-muted mb-1.5">{t.pages.calculator.workmanshipOptionalLabel}</label>
            <Input
              type="number"
              min="0"
              step="1"
              value={workmanship}
              onChange={(e) => setWorkmanship(e.target.value)}
              disabled={mode === 'sell'}
            />
          </div>

          <div>
            <label className="block text-[12px] text-muted mb-1.5">{t.pages.calculator.operationTypeLabel}</label>
            <TogglePair
              options={[
                { value: 'buy', label: t.pages.calculator.iAmBuying },
                { value: 'sell', label: t.pages.calculator.iAmSelling },
              ]}
              value={mode}
              onChange={(v) => setMode(v as 'buy' | 'sell')}
            />
          </div>
        </div>
      </SectionCard>

      {/* Result */}
      <div className="bg-gold-soft shadow-gold rounded-2xl p-6 md:p-7 flex flex-col justify-center">
        <div className="text-[13px] text-muted mb-2">
          {mode === 'buy' ? t.pages.calculator.estimatedBuyTotal : t.pages.calculator.estimatedSellTotal}
        </div>
        {isLoading ? (
          <div className="num text-[36px] text-dim">—</div>
        ) : (
          <div className="num text-[42px] md:text-[54px] font-medium text-gold leading-none">
            {formatNumber(parseFloat(total.toFixed(2)))}
          </div>
        )}
        <div className="text-[14px] text-muted mt-2">{t.pages.calculator.egyptianPound}</div>

        <div className="mt-6 space-y-2.5 border-t border-gold-line pt-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">{t.pages.calculator.pricePerGramLabel} ({TYPE_LABELS[type]})</span>
            <span className="num text-text">{priceEntry ? formatNumber(basePrice) : '—'}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">{t.pages.calculator.metalValue}</span>
            <span className="num text-text">{formatNumber(parseFloat(baseTotal.toFixed(2)))}</span>
          </div>
          {mode === 'buy' && (
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted">{t.pages.calculator.workmanshipTotalLabel}</span>
              <span className="num text-text">{formatNumber(parseFloat(workmanshipTotal.toFixed(2)))}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
