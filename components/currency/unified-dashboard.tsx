"use client";

import React, { useMemo, useState } from "react";
import {
  CurrencyCode,
  CURRENCIES,
} from "@/lib/mock-currency-data";
import { BankRatesTable } from "./bank-rates-table";
import { FxConverterCard } from "./fx-converter-card";
import { useCurrencyAverages, useHighestBuyPrice, useCurrencyBanks } from '@/hooks/use-currency-prices';
import { useLanguage } from "@/contexts/language-context";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatTile } from "@/components/ui/stat-tile";
import { SectionCard } from "@/components/ui/section-card";
import { localizedText } from '@/lib/localized-text';
import { BankBadge } from '@/components/ui/bank-badge';
import type { CurrencyDashboardInitialData } from './unified-dashboard-server';

interface UnifiedDashboardProps {
  initialData?: CurrencyDashboardInitialData;
}

const formatRate = (value: unknown) => {
  const rate = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(rate) ? rate.toFixed(2) : '—';
};

export function UnifiedDashboard({ initialData }: UnifiedDashboardProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const contentDirection = isRTL ? 'rtl' : 'ltr';
  const statisticAlignment = isRTL ? 'text-right' : 'text-left';
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');

  const currencyNames: Record<CurrencyCode, string> = {
    'USD': t.currency.usdName,
    'EUR': t.currency.eurName,
    'SAR': t.currency.sarName,
    'AED': t.currency.aedName,
    'KWD': t.currency.kwdName,
    'GBP': t.currency.gbpName,
  };

  const isDefaultCurrency = selectedCurrency === 'USD';

  // Fetch data from API only when not using default currency
  const { data: avgData } = useCurrencyAverages(selectedCurrency as string, 'EGP', !isDefaultCurrency || !initialData);
  const { data: highestBuyData } = useHighestBuyPrice(selectedCurrency as string, !isDefaultCurrency || !initialData);
  const { data: banksData } = useCurrencyBanks(selectedCurrency, 'EGP', '24h', !isDefaultCurrency || !initialData);

  const bankAverage = isDefaultCurrency && initialData ? {
    buy: initialData.averages?.banks?.avg_buy_rate || 0,
    sell: initialData.averages?.banks?.avg_sell_rate || 0,
  } : {
    buy: avgData?.data?.banks?.avg_buy_rate || 0,
    sell: avgData?.data?.banks?.avg_sell_rate || 0,
  };

  const parallelRate = isDefaultCurrency && initialData ? {
    buy: initialData.averages?.parallel_market?.avg_buy_rate || 0,
    sell: initialData.averages?.parallel_market?.avg_sell_rate || 0,
  } : {
    buy: avgData?.data?.parallel_market?.avg_buy_rate || 0,
    sell: avgData?.data?.parallel_market?.avg_sell_rate || 0,
  };

  const bankCount = isDefaultCurrency && initialData
    ? (initialData.averages?.banks?.count || 0)
    : (avgData?.data?.banks?.count || 0);

  // Extract best bank prices
  const bestBuyPrice = isDefaultCurrency && initialData
    ? (initialData.highestBuy?.price || '0')
    : (highestBuyData?.data?.price || '0');
  const bestBuyBank = isDefaultCurrency && initialData
    ? localizedText(initialData.highestBuy?.bank?.name, language, '-')
    : localizedText(highestBuyData?.data?.bank?.name, language, '-');
  const bestBuyLogo = isDefaultCurrency && initialData
    ? initialData.highestBuy?.bank?.bank_logo_url
    : highestBuyData?.data?.bank?.bank_logo_url;
  const lowestSell = useMemo(() => {
    const banks = isDefaultCurrency
      ? initialData?.bankRates?.banks.map((bank) => ({
          rate: bank.latest_sell_rate,
          name: bank.name,
          logo: bank.bank_logo_url,
        }))
      : banksData?.data?.banks.map((bank) => ({
          rate: bank.price.sell,
          name: bank.name,
          logo: bank.bank_logo_url,
        }));

    if (!banks?.length) return null;
    return banks.reduce((lowest, bank) => bank.rate < lowest.rate ? bank : lowest);
  }, [banksData, initialData, isDefaultCurrency]);

  const segmentedItems = CURRENCIES.map((c) => ({ value: c, label: currencyNames[c], mono: c }));

  return (
    <div className="space-y-6" dir={contentDirection}>
      <SegmentedControl items={segmentedItems} value={selectedCurrency} onChange={(v) => setSelectedCurrency(v as CurrencyCode)} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          <div className="grid grid-cols-2 gap-4" dir={contentDirection}>
            <StatTile
              label={t.currency.highestBuyPrice}
              value={formatRate(bestBuyPrice)}
              sub={<span className="text-[11px] text-dim truncate block">{bestBuyBank}</span>}
              className={statisticAlignment}
              leftAdornment={<BankBadge name={bestBuyBank} logoUrl={bestBuyLogo} size={34} />}
            />
            <StatTile
              label={t.currency.lowestSellPrice}
              value={formatRate(lowestSell?.rate)}
              sub={<span className="text-[11px] text-dim truncate block">{localizedText(lowestSell?.name, language, '-')}</span>}
              className={statisticAlignment}
              leftAdornment={<BankBadge name={localizedText(lowestSell?.name, language, '-')} logoUrl={lowestSell?.logo} size={34} />}
            />
            {/*
              label={t.currency.lowestBuyPrice}
              value={lowestBuy ? lowestBuy.rate.toFixed(2) : '—'}
              sub={<span className="text-[11px] text-dim truncate block">{lowestBuy?.bank ?? ''}</span>}
              className={statisticAlignment}
              leftAdornment={<BankBadge name={lowestBuy?.bank ?? ''} logoUrl={lowestBuy?.logo} size={34} />}
            */}
            {/*
              label={t.currency.lowestSellPrice}
              value={lowestSell ? lowestSell.rate.toFixed(2) : '—'}
              sub={<span className="text-[11px] text-dim truncate block">{lowestSell?.bank ?? ''}</span>}
              className={statisticAlignment}
              leftAdornment={<BankBadge name={lowestSell?.bank ?? ''} logoUrl={lowestSell?.logo} size={34} />}
            */}
          </div>

          <BankRatesTable
            showTabs={false}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            initialBankData={isDefaultCurrency ? initialData?.bankRates ?? undefined : undefined}
          />

          <SectionCard title={t.pages.currencies.parallelMarket} action={<span className="chip">{t.currency.unofficialChip}</span>} padded>
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <div className="text-[12px] text-muted mb-1">{t.currency.buy}</div>
                <div className="num text-[22px] text-text">{formatRate(parallelRate.buy)}</div>
              </div>
              <div>
                <div className="text-[12px] text-muted mb-1">{t.currency.sell}</div>
                <div className="num text-[22px] text-text">{formatRate(parallelRate.sell)}</div>
              </div>
              <div>
                <div className="text-[12px] text-muted mb-1">{t.currency.gapVsBanks}</div>
                <div className="num text-[22px] text-gold">
                  {bankAverage.sell > 0 ? (parallelRate.sell - bankAverage.sell).toFixed(2) : '—'}
                </div>
              </div>
            </div>
            <div className="mt-3 text-[11.5px] text-dim">
              {isRTL
                ? `أسعار استرشادية وقد تختلف عن السعر الفعلي · متوسط ${bankCount} بنكاً`
                : `Indicative rates that may differ from the actual price · average of ${bankCount} banks`}
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <FxConverterCard />
      </div>
    </div>
  );
}
