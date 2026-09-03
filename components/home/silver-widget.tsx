'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { SectionCard } from '@/components/ui/section-card';
import { LiveDot } from '@/components/ui/live-dot';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeText } from '@/components/ui/change-badge';
import { MonoNumber } from '@/components/ui/mono-number';
import { PriceAlertModal } from '@/components/dashboard/price-alert-modal';
import { useLanguage } from '@/contexts/language-context';
import { SilverDataItem, getSilverName } from './silver-data-utils';

function SilverPriceRow({ item, onAlert }: { item: SilverDataItem; onAlert: (item: SilverDataItem) => void }) {
  const { t, language } = useLanguage();
  const name = getSilverName(item.nameKey, language === 'ar');

  return (
    <div className="group/row flex items-center gap-3 px-5 py-3.5 border-b border-line2 last:border-b-0 hover:bg-hover transition-colors">
      <LiveDot tone="gold" size={6} />
      <span className="text-[14px] text-text flex-1 min-w-0 truncate">{name}</span>
      {item.chartPoints.length >= 2 ? (
        <Sparkline data={item.chartPoints} width={48} height={16} tone="auto" />
      ) : (
        <span className="w-12" />
      )}
      <MonoNumber value={item.sellPrice} currency={item.currency} className="text-[15px] font-medium text-text whitespace-nowrap" />
      <span className="w-[56px] text-end shrink-0">
        <ChangeText value={item.changePercent} withArrow={false} />
      </span>
      <button
        type="button"
        onClick={() => onAlert(item)}
        className="rounded-md p-1 text-dim opacity-0 group-hover/row:opacity-100 hover:text-gold transition-opacity"
        aria-label={`${t.home2026.createAlertFor} ${name}`}
      >
        <Bell className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface SilverWidgetClientProps {
  silverItems: SilverDataItem[];
}

export function SilverWidgetClient({ silverItems }: SilverWidgetClientProps) {
  const { t, language } = useLanguage();
  const [alertItem, setAlertItem] = useState<SilverDataItem | null>(null);

  return (
    <SectionCard
      title={t.home2026.silver}
      action={
        <Link href="/silver" className="text-[13px] text-gold hover:opacity-75 transition-opacity">
          {t.home2026.details}
        </Link>
      }
    >
      <div>
        {silverItems.map((item) => (
          <SilverPriceRow key={item.id} item={item} onAlert={setAlertItem} />
        ))}
      </div>

      {alertItem && (
        <PriceAlertModal
          isOpen
          onClose={() => setAlertItem(null)}
          goldType={getSilverName(alertItem.nameKey, language === 'ar')}
          currentPrice={alertItem.sellPrice}
          currency={alertItem.currency}
        />
      )}
    </SectionCard>
  );
}
