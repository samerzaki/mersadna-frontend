'use client';

import { SectionCard } from '@/components/ui/section-card';
import { useGoldOverview } from '@/hooks/use-gold-prices';
import { useSilverOverview } from '@/hooks/use-silver-prices';
import { WORKMANSHIP_RANGES } from '@/lib/constants';
import { formatPriceWithCurrency } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';

export function GoldExtraCards() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const { data: goldData } = useGoldOverview();
  const { data: silverData } = useSilverOverview();

  const ounceGold = goldData?.data?.gold?.ounce;
  const ounceSilver = silverData?.data?.silver?.ounce;

  const WORKMANSHIP_ROWS = [
    { label: t.gold.karat24, value: WORKMANSHIP_RANGES.karat24 },
    { label: t.gold.karat21, value: WORKMANSHIP_RANGES.karat21 },
    { label: t.gold.karat18, value: WORKMANSHIP_RANGES.karat18 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SectionCard title={t.gold.workmanshipTitle} action={<span className="chip">{t.gold.estimatedChip}</span>} padded>
        <div className="space-y-3">
          {WORKMANSHIP_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[13px] text-muted">{row.label}</span>
              <span className="num text-[14px] text-text">
                {row.value.min}–{row.value.max} {t.common.egp}/{isRTL ? 'جم' : 'g'}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t.gold.globalIndicators} padded>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted">{t.gold.goldOunceLabel}</span>
            <span className="num text-[14px] text-text">
              {ounceGold ? formatPriceWithCurrency(ounceGold.sell_price, ounceGold.currency, 'en-US') : '—'}
            </span>
          </div>
          {ounceSilver && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-muted">{t.gold.silverOunceLabel}</span>
              <span className="num text-[14px] text-text">
                {formatPriceWithCurrency(ounceSilver.sell_price, ounceSilver.currency, 'en-US')}
              </span>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
