'use client';

import Link from 'next/link';
import { SectionCard } from '@/components/ui/section-card';
import { LiveDot } from '@/components/ui/live-dot';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeText } from '@/components/ui/change-badge';
import { useLanguage } from '@/contexts/language-context';
import { SilverDataItem, getSilverName } from './silver-data-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/format';

function SilverPriceRow({ item }: { item: SilverDataItem }) {
  const { t, language } = useLanguage();
  const name = getSilverName(item.nameKey, language === 'ar');

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-line2 last:border-b-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help" aria-label={item.lastCheckedAtForHuman ?? undefined}>
            <LiveDot tone={item.live ? 'up' : 'down'} size={6} />
          </span>
        </TooltipTrigger>
        {item.lastCheckedAtForHuman && (
          <TooltipContent className="!bg-black !text-white">{item.lastCheckedAtForHuman}</TooltipContent>
        )}
      </Tooltip>
      <span className="text-[14px] text-text flex-1 min-w-0 truncate">{name}</span>
      <span
        className="flex items-baseline gap-1 whitespace-nowrap"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        style={{ direction: language === 'ar' ? 'rtl' : 'ltr', unicodeBidi: 'isolate' }}
      >
        <span className="num text-[15px] font-medium text-text">{formatNumber(item.sellPrice)}</span>
        <span className="text-[11px] text-dim">
          {item.currency === 'USD' ? 'USD' : language === 'ar' ? t.home2026.egyptianPound : 'EGP'}
        </span>
      </span>
      {item.chartPoints.length >= 2 ? (
        <Sparkline data={item.chartPoints} width={48} height={16} tone="auto" />
      ) : (
        <span className="w-12" />
      )}
      <span className="w-[56px] text-end shrink-0">
        <ChangeText
          value={item.changePercent}
          withArrow={false}
          tone={item.changeColor === 'green' ? 'up' : item.changeColor === 'red' ? 'down' : undefined}
          className="text-[11.5px]"
        />
      </span>
    </div>
  );
}

interface SilverWidgetClientProps {
  silverItems: SilverDataItem[];
}

export function SilverWidgetClient({ silverItems }: SilverWidgetClientProps) {
  const { t, language } = useLanguage();
  return (
    <SectionCard
      title={t.home2026.silver}
      action={
        <Link href="/silver" className="text-[13px] text-gold hover:opacity-75 transition-opacity">
          {t.home2026.details}
        </Link>
      }
    >
      <TooltipProvider delayDuration={150}>
        <div>
          {silverItems.map((item) => (
            <SilverPriceRow key={item.id} item={item} />
          ))}
        </div>
      </TooltipProvider>
    </SectionCard>
  );
}
