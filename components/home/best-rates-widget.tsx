'use client';

import { useState } from 'react';
import { Landmark, Calculator, ArrowDownLeft, ArrowUpRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CurrencyCode } from '@/lib/mock-currency-data';
import { useLanguage } from '@/contexts/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCIES } from '@/lib/currency-constants';
import { useHighestBuyPrice, useHighestSellPrice, useCurrencyAverages } from '@/hooks/use-currency-prices';
import type { BestRatesInitialData } from './best-rates-widget-server';

// Main currencies shown as tabs
const MAIN_CURRENCIES: CurrencyCode[] = ['USD', 'SAR', 'EUR'];
// Extra currencies in dropdown
const EXTRA_CURRENCIES: CurrencyCode[] = ['AED', 'KWD', 'GBP'];

interface BestRatesWidgetClientProps {
  initialData: BestRatesInitialData;
}

export function BestRatesWidgetClient({ initialData }: BestRatesWidgetClientProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [showMoreCurrencies, setShowMoreCurrencies] = useState(false);

  const isDefaultCurrency = selectedCurrency === 'USD';

  // Only fetch from client when not using default currency
  const { data: highestBuyData, isLoading: buyLoadingClient } = useHighestBuyPrice(selectedCurrency, !isDefaultCurrency);
  const { data: highestSellData, isLoading: sellLoadingClient } = useHighestSellPrice(selectedCurrency, !isDefaultCurrency);
  const { data: averagesData, isLoading: averagesLoadingClient } = useCurrencyAverages(selectedCurrency, 'EGP', !isDefaultCurrency);

  // Use server data for USD, client data for other currencies
  const bestBuy = isDefaultCurrency ? initialData.highestBuy : highestBuyData?.data;
  const bestSell = isDefaultCurrency ? initialData.highestSell : highestSellData?.data;
  const parallelMarket = isDefaultCurrency ? initialData.parallelMarket : averagesData?.data?.parallel_market;

  const buyLoading = isDefaultCurrency ? false : buyLoadingClient;
  const sellLoading = isDefaultCurrency ? false : sellLoadingClient;
  const averagesLoading = isDefaultCurrency ? false : averagesLoadingClient;

  // Get translated currency name
  const getCurrencyName = (code: CurrencyCode): string => {
    const currencyNames: Record<CurrencyCode, string> = {
      USD: t.currency.dollar,
      EUR: t.currency.euro,
      SAR: language === 'ar' ? 'الريال السعودي' : 'Saudi Riyal',
      AED: language === 'ar' ? 'الدرهم الإماراتي' : 'UAE Dirham',
      KWD: language === 'ar' ? 'الدينار الكويتي' : 'Kuwaiti Dinar',
      GBP: language === 'ar' ? 'الجنيه الإسترليني' : 'British Pound',
    };
    return currencyNames[code] || code;
  };

  // Show widget even with errors or missing data - use fallback values
  const hasBuyData = bestBuy && bestBuy.bank && bestBuy.bank.name && bestBuy.price;
  const hasSellData = bestSell && bestSell.bank && bestSell.bank.name && bestSell.price;
  const hasParallelData = parallelMarket && parallelMarket.avg_buy_rate && parallelMarket.avg_sell_rate;

  // Default fallback data
  const buyFallback = {
    bank: {
      id: 0,
      name: 'جاري التحميل...',
      code: 'loading',
    },
    price: '0',
    from_currency: selectedCurrency,
    to_currency: 'EGP',
  };

  const sellFallback = {
    bank: {
      id: 0,
      name: 'جاري التحميل...',
      code: 'loading',
    },
    price: '0',
    from_currency: selectedCurrency,
    to_currency: 'EGP',
  };

  const displayBuy = hasBuyData ? bestBuy : buyFallback;
  const displaySell = hasSellData ? bestSell : sellFallback;

  return (
    <section className="flex flex-col w-full">
      {/* Section Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <Link
            href="/currencies"
            className="group"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 transition-colors group-hover:text-primary">

              <Landmark className="h-6 w-6 text-primary" />
              {isRTL ? 'أسعار العملات' : 'Currency Rates'}

            </h2>
          </Link>
          <Link
            href="/currencies/calculator"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {isRTL ? 'حاسبة' : 'Calculator'}
          </Link>
        </div>
      </div>

      {/* Compact Split Card */}
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-slate-100 dark:border-border overflow-hidden flex-1">
        {/* Micro-Header: Status Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 dark:border-border bg-slate-50/80 dark:bg-secondary">
          {/* Left: Currency Tabs */}
          <div className="flex items-center gap-1">
            {MAIN_CURRENCIES.map((currency) => {
              const isActive = selectedCurrency === currency;
              const currName = getCurrencyName(currency);
              return (
                <button
                  key={currency}
                  onClick={() => { setSelectedCurrency(currency); setShowMoreCurrencies(false); }}
                  className={`
                    px-2 py-0.5 rounded-md text-xs font-medium transition-colors
                    ${isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold'
                      : 'text-slate-500 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-secondary'
                    }
                  `}
                  title={currency}
                >
                  {currName}
                </button>
              );
            })}
            {/* More currencies dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreCurrencies(!showMoreCurrencies)}
                className={`
                  px-2 py-0.5 rounded-md text-xs font-medium transition-colors flex items-center gap-0.5
                  ${EXTRA_CURRENCIES.includes(selectedCurrency)
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold'
                    : 'text-slate-500 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-secondary'
                  }
                `}
              >
                {EXTRA_CURRENCIES.includes(selectedCurrency)
                  ? getCurrencyName(selectedCurrency)
                  : (isRTL ? 'عملات اخري' : 'More')
                }
                <ChevronDown className={`w-3 h-3 transition-transform ${showMoreCurrencies ? 'rotate-180' : ''}`} />
              </button>
              {showMoreCurrencies && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMoreCurrencies(false)} />
                  <div className="absolute top-full mt-1 start-0 z-20 bg-white dark:bg-card rounded-lg shadow-lg border border-slate-200 dark:border-border py-1 min-w-35">
                    {EXTRA_CURRENCIES.map((currency) => {
                      const isActive = selectedCurrency === currency;
                      return (
                        <button
                          key={currency}
                          onClick={() => { setSelectedCurrency(currency); setShowMoreCurrencies(false); }}
                          className={`
                            w-full text-start px-3 py-1.5 text-xs font-medium transition-colors
                            ${isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-secondary'
                            }
                          `}
                        >
                          {getCurrencyName(currency)}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Last Update */}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">
              {t.gold.live}
            </span>
          </div>
        </div>

        {/* Two Columns: Buy & Sell */}
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-100 dark:divide-border">
          {/* Column 1: اعلي سعر شراء */}
          <div>
            <div className="px-4 py-2.5 bg-green-50/50 dark:bg-green-900/10 border-b border-slate-100 dark:border-border">
              <h3 className="text-sm font-bold text-green-700 dark:text-green-400 text-center flex items-center justify-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4" />
                {isRTL ? 'اعلي سعر شراء' : 'Highest Buy'}
              </h3>
            </div>
            {/* Row 1: سعر البنك */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-border">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-secondary overflow-hidden border border-slate-200 dark:border-border shrink-0">
                  {hasBuyData && bestBuy.bank.bank_logo_url ? (
                    <Image
                      src={bestBuy.bank.bank_logo_url}
                      alt={displayBuy.bank.name}
                      fill
                      className="object-contain p-1.5"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-slate-400 dark:text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {isRTL ? 'سعر البنك' : 'Bank Rate'}
                    </span>
                  </div>
                  {buyLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400 tabular-nums">
                          {parseFloat(displayBuy.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-muted-foreground">
                          {t.common.egp}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {displayBuy.bank.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Row 2: السوق الموازي */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-slate-500 dark:text-muted-foreground">
                    {isRTL ? 'السوق الموازي' : 'Parallel Market'}
                  </span>
                  {averagesLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {hasParallelData ? parallelMarket.avg_buy_rate.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-muted-foreground">
                        {t.common.egp}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: اعلي سعر بيع */}
          <div>
            <div className="px-4 py-2.5 bg-primary-50/50 dark:bg-primary-900/10 border-b border-slate-100 dark:border-border">
              <h3 className="text-sm font-bold text-primary-700 dark:text-primary-400 text-center flex items-center justify-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" />
                {isRTL ? 'اعلي سعر بيع' : 'Highest Sell'}
              </h3>
            </div>
            {/* Row 1: سعر البنك */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-border">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-secondary overflow-hidden border border-slate-200 dark:border-border shrink-0">
                  {hasSellData && bestSell.bank.bank_logo_url ? (
                    <Image
                      src={bestSell.bank.bank_logo_url}
                      alt={displaySell.bank.name}
                      fill
                      className="object-contain p-1.5"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-slate-400 dark:text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {isRTL ? 'سعر البنك' : 'Bank Rate'}
                    </span>
                  </div>
                  {sellLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                          {parseFloat(displaySell.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-muted-foreground">
                          {t.common.egp}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {displaySell.bank.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Row 2: السوق الموازي */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-200 dark:border-orange-800 shrink-0">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-slate-500 dark:text-muted-foreground">
                    {isRTL ? 'السوق الموازي' : 'Parallel Market'}
                  </span>
                  {averagesLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                        {hasParallelData ? parallelMarket.avg_sell_rate.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-muted-foreground">
                        {t.common.egp}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
