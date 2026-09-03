'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Shuffle } from 'lucide-react';
import { CURRENCIES } from '@/lib/currency-constants';
import type { CurrencyCode } from '@/lib/mock-currency-data';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BankBadge } from '@/components/ui/bank-badge';
import { MonoNumber } from '@/components/ui/mono-number';
import { formatSigned } from '@/lib/format';
import { useHighestBuyPrice, useHighestSellPrice, useCurrencyAverages } from '@/hooks/use-currency-prices';
import { useLanguage } from '@/contexts/language-context';
import type { BestRatesInitialData, BestRatesBank } from './best-rates-widget-server';

const SEGMENTED_ITEMS = CURRENCIES.map((c) => ({ value: c.code, label: c.name, mono: c.code }));

interface BestRatesWidgetClientProps {
  initialData: BestRatesInitialData;
}

function RateCard({
  label,
  tone,
  icon,
  bank,
  price,
  loading,
  chip,
}: {
  label: string;
  tone: 'up' | 'down' | 'gold';
  icon: React.ReactNode;
  bank?: BestRatesBank;
  price?: string;
  loading?: boolean;
  chip?: string;
}) {
  const { t } = useLanguage();
  const toneClass = tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-gold';

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 font-heading text-[15px] font-semibold text-text">
          <span className={toneClass}>{icon}</span>
          {label}
        </span>
        {chip && <span className="chip">{chip}</span>}
      </div>

      {loading || !bank || !price ? (
        <div className="h-10 w-32 bg-panel2 rounded animate-pulse" />
      ) : (
        <>
          <div className="flex items-start gap-2.5">
            <BankBadge name={bank.name} logoUrl={bank.bank_logo_url} size={34} />
            <div className="min-w-0">
              <span className="block text-[13px] text-muted truncate">{bank.name}</span>
              <div className={`num mt-1 text-right text-[36px] md:text-[40px] font-medium leading-none ${toneClass}`}>
                {parseFloat(price).toFixed(2)}
              </div>
              <div className="mt-1.5 text-right text-[11px] text-dim">{t.home2026.egyptianPound}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ParallelCard({
  averages,
  loading,
}: {
  averages: BestRatesInitialData['averages'];
  loading?: boolean;
}) {
  const { t } = useLanguage();
  const parallel = averages?.parallel_market;
  const banks = averages?.banks;
  const gap = parallel && banks ? parallel.avg_sell_rate - banks.avg_sell_rate : null;

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 font-heading text-[15px] font-semibold text-text">
          <Shuffle className="size-[15px] text-gold" />
          {t.home2026.parallelMarket}
        </span>
        <span className="flex items-center gap-1.5 text-[11.5px] text-dim">
          <span>{t.home2026.gapVsBanks}</span>
          {gap !== null ? (
            <span className={`num ${gap >= 0 ? 'text-up' : 'text-down'}`}>{formatSigned(gap, 2)}</span>
          ) : (
            <span className="num">—</span>
          )}
        </span>
      </div>

      {loading || !parallel ? (
        <div className="h-10 w-32 bg-panel2 rounded animate-pulse" />
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[12px] text-muted">{t.home2026.buy}</span>
            <MonoNumber value={parallel.avg_buy_rate} currency="EGP" className="text-[22px] font-medium text-text" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-muted">{t.home2026.sell}</span>
            <MonoNumber value={parallel.avg_sell_rate} currency="EGP" className="text-[22px] font-medium text-text" />
          </div>
        </>
      )}
    </div>
  );
}

export function BestRatesWidgetClient({ initialData }: BestRatesWidgetClientProps) {
  const { t } = useLanguage();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const isDefaultCurrency = selectedCurrency === 'USD';

  const { data: highestBuyData, isLoading: buyLoadingClient } = useHighestBuyPrice(selectedCurrency, !isDefaultCurrency);
  const { data: highestSellData, isLoading: sellLoadingClient } = useHighestSellPrice(selectedCurrency, !isDefaultCurrency);
  const { data: averagesData, isLoading: averagesLoadingClient } = useCurrencyAverages(selectedCurrency, 'EGP', !isDefaultCurrency);

  const bestBuy = isDefaultCurrency ? initialData.highestBuy : highestBuyData?.data ?? null;
  const bestSell = isDefaultCurrency ? initialData.highestSell : highestSellData?.data ?? null;
  const averages = isDefaultCurrency
    ? initialData.averages
    : averagesData?.data
      ? { banks: averagesData.data.banks, parallel_market: averagesData.data.parallel_market }
      : null;

  const buyLoading = isDefaultCurrency ? false : buyLoadingClient;
  const sellLoading = isDefaultCurrency ? false : sellLoadingClient;
  const averagesLoading = isDefaultCurrency ? false : averagesLoadingClient;

  const currencyMeta = CURRENCIES.find((c) => c.code === selectedCurrency);
  const currencyName = currencyMeta?.name ?? selectedCurrency;

  return (
    <section>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <Link href="/currencies" className="group">
          <h2 className="font-heading text-[22px] md:text-[25px] font-semibold text-text transition-colors group-hover:text-gold">
            {t.home2026.bestBankRatePrefix} {currencyName} {t.home2026.bestBankRateSuffix}
          </h2>
        </Link>
        <SegmentedControl items={SEGMENTED_ITEMS} value={selectedCurrency} onChange={(v) => setSelectedCurrency(v as CurrencyCode)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RateCard
          label={t.home2026.highestBuyPrice}
          tone="up"
          icon={<ArrowDownLeft className="size-[15px]" />}
          bank={bestBuy?.bank}
          price={bestBuy?.price}
          loading={buyLoading}
        />
        <RateCard
          label={t.home2026.highestSellPrice}
          tone="down"
          icon={<ArrowUpRight className="size-[15px]" />}
          bank={bestSell?.bank}
          price={bestSell?.price}
          loading={sellLoading}
        />
        <ParallelCard averages={averages} loading={averagesLoading} />
      </div>
    </section>
  );
}
