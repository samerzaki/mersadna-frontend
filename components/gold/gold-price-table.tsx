'use client';

import { SectionCard } from '@/components/ui/section-card';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeText } from '@/components/ui/change-badge';
import { formatPriceWithCurrency } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { translations, type Language } from '@/lib/translations';
import { useEffect, useState } from 'react';
import type { ModernGoldDataItem } from '@/components/dashboard/modern-gold-prices-server';

const ROW_ORDER: ModernGoldDataItem['nameKey'][] = ['karat24', 'karat21', 'karat18', 'pound', 'ounce'];

function getName(nameKey: string, t: any) {
  const names: Record<string, string> = {
    karat24: t.gold.karat24,
    karat21: t.gold.karat21,
    karat18: t.gold.karat18,
    pound: t.gold.pound,
    ounce: t.gold.ounce,
  };
  return names[nameKey] || nameKey;
}

interface GoldPriceTableProps {
  goldData: ModernGoldDataItem[];
}

export function GoldPriceTable({ goldData }: GoldPriceTableProps) {
  const { language } = useLanguage();
  const [displayLanguage, setDisplayLanguage] = useState<Language>('ar');

  useEffect(() => {
    setDisplayLanguage(language);
  }, [language]);

  const t = translations[displayLanguage];
  const locale = displayLanguage === 'en' ? 'en-US' : 'ar-EG';

  const rows = ROW_ORDER.map((key) => goldData.find((item) => item.nameKey === key)).filter(
    (item): item is ModernGoldDataItem => Boolean(item)
  );

  return (
    <SectionCard title={t.gold.tableTitle} className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className="grid items-center px-[22px] py-3.5 bg-panel2 text-[12px] text-muted"
          style={{ gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr' }}
        >
          <span>{t.gold.karatColumn}</span>
          <span className="text-end">{t.gold.sellPrice}</span>
          <span className="text-end">{t.gold.buyPrice}</span>
          <span className="text-end">{t.gold.changeColumn}</span>
          <span className="text-end">{t.gold.days30Column}</span>
        </div>
        {rows.map((item) => {
          const isOunce = item.nameKey === 'ounce';
          return (
            <div
              key={item.id}
              className="grid items-center px-[22px] py-4 border-t border-[var(--line2)] hover:bg-hover transition-colors"
              style={{ gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr' }}
            >
              <span className="font-heading text-[15px] text-text">{getName(item.nameKey, t)}</span>
              <span className="num text-end text-[16px] md:text-[18px] text-text">
                {formatPriceWithCurrency(item.sellPrice, item.currency, locale)}
              </span>
              <span className="num text-end text-[16px] md:text-[18px] text-muted">
                {isOunce ? '—' : formatPriceWithCurrency(item.buyPrice, item.currency, locale)}
              </span>
              <span className="text-end">
                {isOunce ? <span className="num text-dim">—</span> : <ChangeText value={item.changePercent} />}
              </span>
              <span className="flex justify-end">
                <Sparkline data={item.history} width={64} height={22} tone={isOunce ? 'gold' : 'auto'} />
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
