"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Landmark, Handshake, TrendingUp, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CurrencyCode,
  CURRENCIES,
} from "@/lib/mock-currency-data";
import { BankRatesTable } from "./bank-rates-table";
import { useCurrencyAverages, useHighestBuyPrice, useHighestSellPrice, useBlackMarketRates } from '@/hooks/use-currency-prices';
import type { CurrencyDashboardInitialData } from './unified-dashboard-server';

const currencyNames: Record<CurrencyCode, string> = {
  'USD': 'دولار أمريكي',
  'EUR': 'يورو',
  'SAR': 'ريال سعودي',
  'AED': 'درهم إماراتي',
  'KWD': 'دينار كويتي',
  'GBP': 'جنيه إسترليني'
};

const VISIBLE_CURRENCY_COUNT = 4;

interface UnifiedDashboardProps {
  initialData?: CurrencyDashboardInitialData;
}

export function UnifiedDashboard({ initialData }: UnifiedDashboardProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoreCurrencies, setShowMoreCurrencies] = useState(false);

  const visibleCurrencies = CURRENCIES.slice(0, VISIBLE_CURRENCY_COUNT);
  const hiddenCurrencies = CURRENCIES.slice(VISIBLE_CURRENCY_COUNT);
  const isSelectedInHidden = hiddenCurrencies.includes(selectedCurrency);

  const isDefaultCurrency = selectedCurrency === 'USD';

  // Fetch data from API only when not using default currency
  const { data: avgData } = useCurrencyAverages(selectedCurrency as string, 'EGP', !isDefaultCurrency || !initialData);
  const { data: highestBuyData } = useHighestBuyPrice(selectedCurrency as string, !isDefaultCurrency || !initialData);
  const { data: highestSellData } = useHighestSellPrice(selectedCurrency as string, !isDefaultCurrency || !initialData);
  const { data: blackMarketData } = useBlackMarketRates(selectedCurrency as string, 'EGP', !isDefaultCurrency || !initialData);

  // Use initialData for USD, client data otherwise
  const bankAverage = isDefaultCurrency && initialData ? {
    buy: initialData.averages?.banks?.avg_buy_rate || 0,
    sell: initialData.averages?.banks?.avg_sell_rate || 0,
  } : {
    buy: avgData?.data?.banks?.avg_buy_rate || 0,
    sell: avgData?.data?.banks?.avg_sell_rate || 0,
  };

  // Black market rate for the selected currency
  const blackMarketRateForCurrency = (() => {
    if (isDefaultCurrency && initialData?.blackMarket) {
      const rate = initialData.blackMarket.rates.find(r => r.currency === selectedCurrency);
      return rate ? { buy: rate.buy_rate, sell: rate.sell_rate, lastUpdated: rate.last_updated } : null;
    }
    if (blackMarketData?.data?.rates) {
      const rate = blackMarketData.data.rates.find(r => r.currency === selectedCurrency);
      return rate ? { buy: rate.buy_rate, sell: rate.sell_rate, lastUpdated: rate.last_updated } : null;
    }
    return null;
  })();

  // Fallback to averages parallel_market if black market API has no data for this currency
  const parallelRate = blackMarketRateForCurrency ? {
    buy: blackMarketRateForCurrency.buy,
    sell: blackMarketRateForCurrency.sell,
  } : isDefaultCurrency && initialData ? {
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
  const bestBuyBankLogo = isDefaultCurrency && initialData
    ? (initialData.highestBuy?.bank?.bank_logo_url || '')
    : (highestBuyData?.data?.bank?.bank_logo_url || '');
  const bestSellPrice = isDefaultCurrency && initialData
    ? (initialData.highestSell?.price || '0')
    : (highestSellData?.data?.price || '0');
  const bestSellBank = isDefaultCurrency && initialData
    ? (initialData.highestSell?.bank?.name || '-')
    : (highestSellData?.data?.bank?.name || '-');
  const bestSellBankLogo = isDefaultCurrency && initialData
    ? (initialData.highestSell?.bank?.bank_logo_url || '')
    : (highestSellData?.data?.bank?.bank_logo_url || '');

  return (
    <div className="space-y-6">
      {/* Currency Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="overflow-x-auto scrollbar-hide flex-1">
          <div className="flex gap-2 min-w-max items-center">
            {visibleCurrencies.map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                  selectedCurrency === currency
                    ? "bg-primary-600 dark:bg-primary-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {currencyNames[currency]}
              </button>
            ))}
            {hiddenCurrencies.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMoreCurrencies(!showMoreCurrencies)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1",
                    isSelectedInHidden
                      ? "bg-primary-600 dark:bg-primary-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {isSelectedInHidden ? currencyNames[selectedCurrency] : 'عملات أخرى'}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showMoreCurrencies && "rotate-180")} />
                </button>
                {showMoreCurrencies && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMoreCurrencies(false)} />
                    <div className="absolute top-full mt-2 right-0 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-40">
                      {hiddenCurrencies.map((currency) => (
                        <button
                          key={currency}
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setShowMoreCurrencies(false);
                          }}
                          className={cn(
                            "w-full text-right px-4 py-2 text-sm transition-colors",
                            selectedCurrency === currency
                              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                          )}
                        >
                          {currencyNames[currency]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="relative md:w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن بنك..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 pr-9 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
          />
        </div>
      </div>

      {/* Section A: Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Official Bank Average */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                متوسط البنوك
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Landmark className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                شراء
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {bankAverage.buy.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                بيع
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {bankAverage.sell.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            متوسط أسعار العملات فى {bankCount} بنك
          </p>
        </div>

        {/* Card 2: Black Market / Parallel Market */}
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                السوق السوداء
              </h3>
              {blackMarketRateForCurrency && (
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                  مباشر
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
              <Handshake className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                شراء
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {parallelRate.buy.toFixed(2)}
              </p>
            </div>
            <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                بيع
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {parallelRate.sell.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            أسعار استرشادية وقد تختلف عن السعر الفعلي
          </p>
        </div>

        {/* Card 3: Best Bank Rates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                أفضل الأسعار
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                أعلى شراء
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mb-2">
                {parseFloat(bestBuyPrice).toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                {bestBuyBankLogo && (
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={bestBuyBankLogo}
                      alt={bestBuyBank}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {bestBuyBank}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                أقل بيع
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mb-2">
                {parseFloat(bestSellPrice).toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                {bestSellBankLogo && (
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={bestSellBankLogo}
                      alt={bestSellBank}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {bestSellBank}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Detailed Rates Table */}
      <div className="space-y-4">
        <BankRatesTable
          showTabs={false}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          searchTerm={searchTerm}
          initialBankData={isDefaultCurrency ? initialData?.bankRates ?? undefined : undefined}
        />
      </div>
    </div>
  );
}
