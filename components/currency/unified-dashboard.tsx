"use client";

import React, { useMemo, useState } from "react";
import {
  CurrencyCode,
  CURRENCIES,
} from "@/lib/mock-currency-data";
import { BankRatesTable } from "./bank-rates-table";
import { FxConverterCard } from "./fx-converter-card";
import { useCurrencyAverages, useHighestBuyPrice, useHighestSellPrice, useCurrencyBanks } from '@/hooks/use-currency-prices';
import { useLanguage } from "@/contexts/language-context";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatTile } from "@/components/ui/stat-tile";
import { SectionCard } from "@/components/ui/section-card";
import type { CurrencyDashboardInitialData } from './unified-dashboard-server';

interface UnifiedDashboardProps {
  initialData?: CurrencyDashboardInitialData;
}

export function UnifiedDashboard({ initialData }: UnifiedDashboardProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
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
  const { data: highestSellData } = useHighestSellPrice(selectedCurrency as string, !isDefaultCurrency || !initialData);
  const { data: banksHookData } = useCurrencyBanks(selectedCurrency, 'EGP', '24h', !isDefaultCurrency || !initialData);

  const bankList = useMemo(() => {
    if (isDefaultCurrency && initialData?.bankRates) return initialData.bankRates.banks;
    if (banksHookData?.success && banksHookData.data?.banks) return banksHookData.data.banks;
    return [];
  }, [isDefaultCurrency, initialData, banksHookData]);

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
    ? (initialData.highestBuy?.bank?.name || '-')
    : (highestBuyData?.data?.bank?.name || '-');
  const bestSellPrice = isDefaultCurrency && initialData
    ? (initialData.highestSell?.price || '0')
    : (highestSellData?.data?.price || '0');
  const bestSellBank = isDefaultCurrency && initialData
    ? (initialData.highestSell?.bank?.name || '-')
    : (highestSellData?.data?.bank?.name || '-');

  // Lowest buy / sell computed from the full bank list
  const { lowestBuy, lowestSell } = useMemo(() => {
    if (!bankList.length) return { lowestBuy: null as null | { rate: number; bank: string }, lowestSell: null as null | { rate: number; bank: string } };
    const buyMin = bankList.reduce((min, b) => (b.latest_buy_rate < min.latest_buy_rate ? b : min));
    const sellMin = bankList.reduce((min, b) => (b.latest_sell_rate < min.latest_sell_rate ? b : min));
    return {
      lowestBuy: { rate: buyMin.latest_buy_rate, bank: buyMin.name },
      lowestSell: { rate: sellMin.latest_sell_rate, bank: sellMin.name },
    };
  }, [bankList]);

  const segmentedItems = CURRENCIES.map((c) => ({ value: c, label: currencyNames[c], mono: c }));

  return (
    <div className="space-y-6">
      <SegmentedControl items={segmentedItems} value={selectedCurrency} onChange={(v) => setSelectedCurrency(v as CurrencyCode)} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              label={t.currency.highestBuyPrice}
              value={parseFloat(bestBuyPrice).toFixed(2)}
              sub={<span className="text-[11px] text-dim truncate block">{bestBuyBank}</span>}
            />
            <StatTile
              label={t.currency.highestSellPrice}
              value={parseFloat(bestSellPrice).toFixed(2)}
              sub={<span className="text-[11px] text-dim truncate block">{bestSellBank}</span>}
            />
            <StatTile
              label={t.currency.lowestBuyPrice}
              value={lowestBuy ? lowestBuy.rate.toFixed(2) : '—'}
              sub={<span className="text-[11px] text-dim truncate block">{lowestBuy?.bank ?? ''}</span>}
            />
            <StatTile
              label={t.currency.lowestSellPrice}
              value={lowestSell ? lowestSell.rate.toFixed(2) : '—'}
              sub={<span className="text-[11px] text-dim truncate block">{lowestSell?.bank ?? ''}</span>}
            />
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
                <div className="num text-[22px] text-text">{parallelRate.buy.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[12px] text-muted mb-1">{t.currency.sell}</div>
                <div className="num text-[22px] text-text">{parallelRate.sell.toFixed(2)}</div>
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
