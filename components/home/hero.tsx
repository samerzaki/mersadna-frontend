'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { StatTile } from '@/components/ui/stat-tile';
import { LiveDot } from '@/components/ui/live-dot';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeChip, ChangeText } from '@/components/ui/change-badge';
import { MonoNumber } from '@/components/ui/mono-number';
import { formatNumber, formatSigned, formatRelativeTime, cairoClock } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { PriceAlertModal } from '@/components/dashboard/price-alert-modal';
import type { GoldOverviewItem, GoldOunceItem } from '@/types';

export interface HeroKaratRow {
  id: string;
  name: string;
  sellPrice: number;
  currency: string;
  changePercent: number | null;
  chartPoints: number[];
}

interface HeroProps {
  karat21: GoldOverviewItem | GoldOunceItem | null;
  lastCheckedAt?: string;
  lastCheckedAtForHuman?: string;
  history30d: number[];
  rows: HeroKaratRow[];
}

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(cairoClock());
    const id = setInterval(() => setTime(cairoClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="num text-[13px] text-text">{time ?? '--:--:--'}</span>;
}

export function Hero({ karat21, lastCheckedAt, lastCheckedAtForHuman, history30d, rows }: HeroProps) {
  const { language, t } = useLanguage();
  const [alertOpen, setAlertOpen] = useState(false);

  const sellPrice = karat21?.sell_price ?? 0;
  const buyPrice = karat21?.buy_price ?? 0;
  const currency = karat21?.currency ?? 'EGP';
  const spreadEgp = karat21 && 'spread_egp' in karat21 ? karat21.spread_egp : 0;
  const spreadPercent = karat21 && 'spread_percent' in karat21 ? karat21.spread_percent : null;
  const recordedAt = karat21?.recorded_at ?? lastCheckedAt;

  const validHistory = history30d.filter(Number.isFinite);
  const move30d =
    validHistory.length >= 2 && validHistory[0] !== 0
      ? ((validHistory[validHistory.length - 1] - validHistory[0]) / validHistory[0]) * 100
      : null;

  const updatedAgo = lastCheckedAtForHuman || (recordedAt ? formatRelativeTime(recordedAt, language) : null);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-11 py-7 md:py-10">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <LiveDot tone="gold" size={7} />
          <span className="text-[13px] text-muted">{t.home2026.liveCairo}</span>
          <LiveClock />
        </div>

        <h1 className="font-heading text-[17px] md:text-[18px] font-semibold text-muted mb-2">
          {t.home2026.gold21Title}
        </h1>

        <div className="flex items-end gap-3 flex-wrap mb-3">
          <span className="num font-medium leading-[0.84] tracking-[-3px] md:tracking-[-5px] text-gold text-[56px] md:text-[106px]">
            {formatNumber(Math.round(sellPrice))}
          </span>
          <span className="text-muted text-[16px] md:text-[19px] mb-1 md:mb-3">{t.common.egp}</span>
          <span className="mb-1 md:mb-3">
            <ChangeChip value={spreadPercent} />
          </span>
        </div>

        <p className="text-[13px] text-muted mb-7">
          <span className="num">{formatSigned(spreadEgp, 0)}</span> {t.common.egp} {t.home2026.vsYesterday}
          {updatedAgo && <> · {t.home2026.lastUpdate} {updatedAgo}</>}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
          <StatTile label={t.home2026.consumerSell} value={formatNumber(Math.round(sellPrice))} compact />
          <StatTile label={t.home2026.goldsmithBuy} value={formatNumber(Math.round(buyPrice))} compact />
          <div className="stat-tile flex-1 flex flex-col justify-between">
            <div className="text-[11.5px] text-dim">{t.home2026.move30Days}</div>
            <div className="flex items-center gap-2 mt-2">
              {validHistory.length >= 2 && <Sparkline data={validHistory} tone="auto" width={50} height={18} />}
              {move30d !== null ? (
                <ChangeText value={move30d} withArrow={false} className="text-[14px]" />
              ) : (
                <span className="num text-[14px] text-dim">—</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="inverse" size="lg">
            <Link href="/gold/calculator">
              <Calculator className="size-4" />
              {t.home2026.calculatePurchase}
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => setAlertOpen(true)}>
            <Bell className="size-4" />
            {t.home2026.notifyPriceChange}
          </Button>
        </div>
      </div>

      {/* Right */}
      <SectionCard
        title={t.home2026.allKaratsNow}
        action={
          <Link href="/gold" className="text-[13px] text-gold hover:opacity-75 transition-opacity">
            {t.home2026.details}
          </Link>
        }
      >
        <div className="p-2.5">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 px-4 py-[18px] rounded-xl hover:bg-hover transition-colors"
            >
              <LiveDot tone={row.changePercent === null ? 'gold' : row.changePercent >= 0 ? 'up' : 'down'} size={7} />
              <span className="font-heading text-[15px] text-text min-w-0 truncate">{row.name}</span>
              {row.chartPoints.length >= 2 ? (
                <Sparkline data={row.chartPoints} width={60} height={18} tone="auto" />
              ) : (
                <span className="w-[60px]" />
              )}
              <span className="flex items-baseline gap-3 justify-end">
                <MonoNumber
                  value={row.sellPrice}
                  currency={row.currency}
                  locale={row.currency === 'USD' ? 'en-US' : 'ar-EG'}
                  className="text-[20px] md:text-[22px] font-medium text-text whitespace-nowrap"
                />
                <span className="w-[58px] text-end shrink-0">
                  <ChangeText value={row.changePercent} withArrow={false} className="text-[12.5px]" />
                </span>
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <PriceAlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        goldType={t.home2026.gold21Title}
        currentPrice={sellPrice}
        currency={currency}
      />
    </section>
  );
}
