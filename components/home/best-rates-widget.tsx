'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Shuffle } from 'lucide-react';
import { CURRENCIES } from '@/lib/currency-constants';
import type { CurrencyCode } from '@/lib/mock-currency-data';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BankBadge } from '@/components/ui/bank-badge';
import { formatSigned } from '@/lib/format';
import { useHighestBuyPrice, useCurrencyAverages, useCurrencyBanks } from '@/hooks/use-currency-prices';
import { useLanguage } from '@/contexts/language-context';
import { localizedText } from '@/lib/localized-text';
import type { BestRatesInitialData, BestRatesBank } from './best-rates-widget-server';

const SEGMENTED_ITEMS = CURRENCIES.map((c) => ({ value: c.code, label: c.name, mono: c.code }));

interface BestRatesWidgetClientProps {
  initialData: BestRatesInitialData;
}

type DisplayBank = Omit<BestRatesBank, 'name'> & { name: string };

function displayRate(
  rate: { price: string; bank: BestRatesBank } | null | undefined,
  language: 'ar' | 'en'
) {
  if (!rate?.bank) return null;
  return {
    ...rate,
    bank: { ...rate.bank, name: localizedText(rate.bank.name, language) },
  };
}

function RateCard({
  label,
  tone,
  icon,
  bank,
  price,
  loading,
  chip,
  titleHref,
}: {
  label: string;
  tone: 'up' | 'down' | 'gold';
  icon: React.ReactNode;
  bank?: DisplayBank;
  price?: string;
  loading?: boolean;
  chip?: string;
  titleHref?: string;
}) {
  const { t } = useLanguage();
  const toneClass = tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : 'text-gold';

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 font-heading text-[15px] font-semibold text-text">
          <span className={toneClass}>{icon}</span>
          {titleHref ? <Link href={titleHref} className="hover:text-gold transition-colors">{label}</Link> : label}
        </span>
        {chip && <span className="chip">{chip}</span>}
      </div>

      {loading || !bank || !price ? (
        <div className="h-10 w-32 bg-panel2 rounded animate-pulse" />
      ) : (
        <>
          <span className="block text-[13px] text-muted truncate">{bank.name}</span>
          <div className="mt-1 grid grid-cols-[minmax(0,max-content)_64px] items-center justify-between gap-x-4">
            <div className={`num text-right text-[36px] md:text-[40px] font-medium leading-none ${toneClass}`}>
              {parseFloat(price).toFixed(2)}
            </div>
            <BankBadge name={bank.name} logoUrl={bank.bank_logo_url} size={64} className="shrink-0" />
            <div className="mt-1.5 text-right text-[11px] text-dim">{t.home2026.egyptianPound}</div>
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
  const { t, language } = useLanguage();
  const parallel = averages?.parallel_market;
  const banks = averages?.banks;
  const gap = parallel && banks ? parallel.avg_sell_rate - banks.avg_sell_rate : null;
  const contentDirection = language === 'ar' ? 'rtl' : 'ltr';
  const contentTextAlign = language === 'ar' ? 'right' : 'left';

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 font-heading text-[15px] font-semibold text-text">
          <Shuffle className="size-[15px] text-gold" />
          <Link href="/currencies" className="hover:text-gold transition-colors">{t.home2026.parallelMarket}</Link>
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
        <div className="grid grid-cols-2 gap-3" dir={contentDirection} style={{ direction: contentDirection }}>
          <div className="min-w-0" dir={contentDirection} style={{ direction: contentDirection, textAlign: contentTextAlign }}>
            <span
              className="block text-[12px] text-muted"
              dir={contentDirection}
              style={{ direction: contentDirection, textAlign: contentTextAlign }}
            >
              {t.home2026.buy}
            </span>
            <div
              className="num mt-2 text-[30px] md:text-[34px] font-medium leading-none text-text"
              dir={contentDirection}
              style={{ direction: contentDirection, textAlign: contentTextAlign }}
            >
              {parallel.avg_buy_rate.toFixed(2)}
            </div>
            <div
              className="mt-1.5 w-full text-[10.5px] text-dim"
              dir={contentDirection}
              style={{ direction: contentDirection, textAlign: contentTextAlign }}
            >
              {t.home2026.egyptianPound}
            </div>
          </div>
          <div className="min-w-0 border-s border-line2 ps-3" dir={contentDirection} style={{ direction: contentDirection, textAlign: contentTextAlign }}>
            <span
              className="block text-[12px] text-muted"
              dir={contentDirection}
              style={{ direction: contentDirection, textAlign: contentTextAlign }}
            >
              {t.home2026.sell}
            </span>
            <div
              className="num mt-2 text-[30px] md:text-[34px] font-medium leading-none text-text"
              dir={contentDirection}
              style={{ direction: contentDirection, textAlign: contentTextAlign }}
            >
              {parallel.avg_sell_rate.toFixed(2)}
            </div>
            <div
              className="mt-1.5 w-full text-[10.5px] text-dim"
              dir={contentDirection}
              style={{ direction: contentDirection, textAlign: contentTextAlign }}
            >
              {t.home2026.egyptianPound}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BestRatesWidgetClient({ initialData }: BestRatesWidgetClientProps) {
  const { t, language } = useLanguage();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const isDefaultCurrency = selectedCurrency === 'USD';

  const { data: highestBuyData, isLoading: buyLoadingClient } = useHighestBuyPrice(selectedCurrency, !isDefaultCurrency);
  const { data: banksData, isLoading: banksLoadingClient } = useCurrencyBanks(selectedCurrency, 'EGP', '24h', !isDefaultCurrency);
  const { data: averagesData, isLoading: averagesLoadingClient } = useCurrencyAverages(selectedCurrency, 'EGP', !isDefaultCurrency);

  const bestBuy = displayRate(isDefaultCurrency ? initialData.highestBuy : highestBuyData?.data, language);
  const clientLowestSell = banksData?.data?.banks.reduce((lowest, bank) =>
    bank.price.sell < lowest.price.sell ? bank : lowest
  );
  const lowestSell = displayRate(
    isDefaultCurrency
      ? initialData.lowestSell
      : clientLowestSell
        ? { price: String(clientLowestSell.price.sell), bank: clientLowestSell }
        : null,
    language
  );
  const averages = isDefaultCurrency
    ? initialData.averages
    : averagesData?.data
      ? { banks: averagesData.data.banks, parallel_market: averagesData.data.parallel_market }
      : null;

  const buyLoading = isDefaultCurrency ? false : buyLoadingClient;
  const sellLoading = isDefaultCurrency ? false : banksLoadingClient;
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
          titleHref="/currencies"
        />
        <RateCard
          label={t.home2026.lowestSellPrice}
          tone="down"
          icon={<ArrowUpRight className="size-[15px]" />}
          bank={lowestSell?.bank}
          price={lowestSell?.price}
          loading={sellLoading}
          titleHref="/currencies"
        />
        <ParallelCard averages={averages} loading={averagesLoading} />
      </div>
    </section>
  );
}
