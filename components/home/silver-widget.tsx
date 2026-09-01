'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Minus, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { PriceAlertModal } from '@/components/dashboard/price-alert-modal';
import { formatPriceWithCurrency } from '@/lib/format';
import { SilverDataItem, getSilverName } from './silver-data-utils';

function TrendIndicator({ trend, changePercent }: Pick<SilverDataItem, 'trend' | 'changePercent'>) {
  if (trend === 'neutral' || changePercent === 0) return <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500"><Minus className="h-3.5 w-3.5" />0%</span>;
  const positive = trend === 'up';
  const Icon = positive ? TrendingUp : TrendingDown;
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}><Icon className="h-3.5 w-3.5" />{Math.abs(changePercent).toFixed(2)}%</span>;
}

function SilverPriceRow({ item, onAlert }: { item: SilverDataItem; onAlert: (item: SilverDataItem) => void }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const locale = isRTL ? 'ar-EG' : 'en-US';
  const name = getSilverName(item.nameKey, isRTL);

  return (
    <div className="group/row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-secondary">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{name}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{isRTL ? 'سعر الجرام' : 'Price per gram'}</p>
      </div>
      <div className="text-end">
        <p className="text-base font-bold tracking-tight text-slate-950 dark:text-white tabular-nums sm:text-lg">{formatPriceWithCurrency(item.sellPrice, item.currency, locale)}</p>
        <div className="mt-1 flex items-center justify-end gap-2">
          <TrendIndicator trend={item.trend} changePercent={item.changePercent} />
          <button type="button" onClick={() => onAlert(item)} className="rounded-md p-1 text-slate-400 opacity-100 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:opacity-0 sm:group-hover/row:opacity-100" aria-label={isRTL ? `إنشاء تنبيه لـ ${name}` : `Create alert for ${name}`}>
            <Bell className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface SilverWidgetClientProps { silverItems: SilverDataItem[]; }

export function SilverWidgetClient({ silverItems }: SilverWidgetClientProps) {
  const [alertItem, setAlertItem] = useState<SilverDataItem | null>(null);
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <section className="flex w-full flex-col">
      <div className="mb-4">
        <Link href="/silver" className="group">
          <h2 className="flex items-center gap-2 text-2xl font-bold transition-colors group-hover:text-primary">
            <Sparkles className="h-6 w-6 text-slate-500" />
            {isRTL ? 'أسعار الفضة' : 'Silver Prices'}
          </h2>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-border dark:bg-card">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-1.5 dark:border-border dark:bg-secondary">
          <span className="text-xs font-medium text-slate-500 dark:text-muted-foreground">{isRTL ? '3 أنواع من الفضة' : '3 Silver Types'}</span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-muted-foreground"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />{isRTL ? 'مباشر' : 'Live'}</span>
        </div>
        <div className="flex-1 divide-y divide-slate-100 dark:divide-border">{silverItems.map((item) => <SilverPriceRow key={item.id} item={item} onAlert={setAlertItem} />)}</div>
      </div>
      {alertItem && <PriceAlertModal isOpen onClose={() => setAlertItem(null)} goldType={getSilverName(alertItem.nameKey, isRTL)} currentPrice={alertItem.sellPrice} currency={alertItem.currency} />}
    </section>
  );
}
