"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  CurrencyCode,
} from "@/lib/mock-currency-data";
import { useCurrencyAverages } from '@/hooks/use-currency-prices';
import { useLanguage } from "@/contexts/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCIES as CURRENCY_DATA } from "@/lib/currency-constants";

export function SmartCurrencyCalculator() {
  const { language, t } = useLanguage();
  const [amount, setAmount] = useState<string>("1000");
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode | 'EGP'>('USD');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode | 'EGP'>('EGP');

  const numericAmount = parseFloat(amount) || 0;

  // Currency name translations map
  const currencyNameMap: Record<string, string> = {
    'USD': t.currency.usdName,
    'EUR': t.currency.eurName,
    'GBP': t.currency.gbpName,
    'SAR': t.currency.sarName,
    'AED': t.currency.aedName,
    'KWD': t.currency.kwdName,
    'EGP': t.currency.egpName,
  };

  // Helper to get currency info with translated name
  const getCurrencyInfo = (code: CurrencyCode | 'EGP') => {
    if (code === 'EGP') {
      return { code: 'EGP', name: currencyNameMap['EGP'], nameEn: 'Egyptian Pound', symbol: 'ج.م', flag: '🇪🇬', displayOrder: 0 };
    }
    const data = CURRENCY_DATA.find(c => c.code === code) || CURRENCY_DATA[0];
    return { ...data, name: currencyNameMap[data.code] || data.name };
  };

  // Determine which currency to fetch rates for
  // Always fetch the non-EGP currency against EGP
  const foreignCurrency = sourceCurrency !== 'EGP' ? sourceCurrency : targetCurrency;
  const isSourceForeign = sourceCurrency !== 'EGP';

  // Fetch real currency averages
  const { data: avgData, isLoading } = useCurrencyAverages(
    foreignCurrency as string,
    'EGP'
  );

  // Calculate conversion scenarios with real API data
  const scenarios = useMemo(() => {
    // Get rates from API data
    const officialRate = avgData?.data?.banks?.avg_sell_rate || 48.50;
    const parallelRate = avgData?.data?.parallel_market?.avg_sell_rate || 63.50;
    const creditCardRate = officialRate * 1.1;

    if (isSourceForeign) {
      // Foreign Currency -> EGP
      return [
        {
          label: t.pages.currencies.cashOfficial,
          amount: numericAmount * officialRate,
          rate: officialRate,
          description: t.pages.currencies.officialDescription,
        },
        {
          label: t.pages.currencies.blackMarket,
          amount: numericAmount * parallelRate,
          rate: parallelRate,
          description: t.pages.currencies.parallelDescription,
        },
        {
          label: t.pages.currencies.creditCard,
          amount: numericAmount * creditCardRate,
          rate: creditCardRate,
          description: t.pages.currencies.creditCardDescription,
        },
      ];
    } else {
      // EGP -> Foreign Currency (reverse calculation)
      return [
        {
          label: t.pages.currencies.cashOfficial,
          amount: numericAmount / officialRate,
          rate: officialRate,
          description: t.pages.currencies.officialDescription,
        },
        {
          label: t.pages.currencies.blackMarket,
          amount: numericAmount / parallelRate,
          rate: parallelRate,
          description: t.pages.currencies.parallelDescription,
        },
        {
          label: t.pages.currencies.creditCard,
          amount: numericAmount / creditCardRate,
          rate: creditCardRate,
          description: t.pages.currencies.creditCardDescription,
        },
      ];
    }
  }, [numericAmount, isSourceForeign, t, avgData]);

  const handleSwap = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Currency Selector Component
  const CurrencySelector = ({ 
    value, 
    onChange, 
    excludeCurrency 
  }: { 
    value: CurrencyCode | 'EGP';
    onChange: (currency: CurrencyCode | 'EGP') => void;
    excludeCurrency?: CurrencyCode | 'EGP';
  }) => {
    const currencyInfo = getCurrencyInfo(value);
    const egpOption = { code: 'EGP' as const, name: currencyNameMap['EGP'], nameEn: 'Egyptian Pound', symbol: 'ج.م', flag: '🇪🇬', displayOrder: 0 };
    const availableCurrencies = [
      ...(excludeCurrency !== 'EGP' ? [egpOption] : []),
      ...CURRENCY_DATA.filter(c => c.code !== excludeCurrency).map(c => ({ ...c, name: currencyNameMap[c.code] || c.name }))
    ];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full",
              "bg-white dark:bg-slate-800",
              "shadow-sm hover:shadow-md",
              "border border-slate-200 dark:border-slate-700",
              "hover:border-primary-500 dark:hover:border-primary-400",
              "transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            )}
          >
            <span className="text-lg" role="img" aria-label={currencyInfo.name}>
              {currencyInfo.flag}
            </span>
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {currencyInfo.code}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableCurrencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => onChange(currency.code)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xl" role="img" aria-label={currency.name}>
                {currency.flag}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currency.code}</span>
                <span className="text-xs text-muted-foreground">{currency.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-8">
      {/* Horizontal Calculator Layout */}
      <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          {/* FROM Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
              {t.currency.from} / From
            </label>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
              <CurrencySelector
                value={sourceCurrency}
                onChange={setSourceCurrency}
                excludeCurrency={targetCurrency}
              />
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className={cn(
                  "w-full text-4xl md:text-5xl font-bold mt-3",
                  "bg-transparent border-0",
                  "focus:outline-none focus:ring-0",
                  "text-slate-900 dark:text-slate-100",
                  "placeholder:text-slate-300 dark:placeholder:text-slate-700",
                  "tabular-nums"
                )}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {getCurrencyInfo(sourceCurrency).name}
              </p>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center lg:mt-8">
            <button
              onClick={handleSwap}
              className={cn(
                "rounded-2xl bg-linear-to-br from-primary-500 to-primary-600",
                "dark:from-primary-600 dark:to-primary-700",
                "shadow-lg hover:shadow-xl",
                "p-4 transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "border border-primary-400/20 dark:border-primary-500/20",
                "focus:outline-none focus:ring-4 focus:ring-primary-500/30",
                "rotate-0 lg:rotate-90"
              )}
              aria-label="Swap currencies"
            >
              <ArrowUpDown className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* TO Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
              {t.currency.to} / To
            </label>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
              <CurrencySelector
                value={targetCurrency}
                onChange={setTargetCurrency}
                excludeCurrency={sourceCurrency}
              />
              <div className="w-full text-4xl md:text-5xl font-bold mt-3 text-slate-900 dark:text-slate-100 tabular-nums">
                {scenarios[0]?.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {getCurrencyInfo(targetCurrency).name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - Enhanced Modern Cards */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2">
          <div className="h-1 w-1 rounded-full bg-primary-500"></div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.currency.exchangeMethods}
          </h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400">
              <div className="w-3 h-3 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
              <span>{t.currency.updating}</span>
            </div>
          )}
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-3 gap-4",
          isLoading && "opacity-50 pointer-events-none"
        )}>
          {scenarios.map((scenario, index) => {
            const isOfficial = index === 0;
            const isParallel = index === 1;
            const isCreditCard = index === 2;

            // Calculate savings/loss compared to official
            const savingsVsOfficial =
              ((scenario.amount - scenarios[0].amount) / scenarios[0].amount) * 100;

            return (
              <div
                key={scenario.label}
                className={cn(
                  "group relative overflow-hidden",
                  "bg-white dark:bg-slate-900",
                  "border-2 transition-all duration-300",
                  "rounded-2xl p-6",
                  "hover:shadow-xl hover:scale-[1.02]",
                  isOfficial && "border-primary-200 dark:border-primary-900/50 hover:border-primary-400 dark:hover:border-primary-700",
                  isParallel && "border-amber-200 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-700",
                  isCreditCard && "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                )}
              >
                {/* Gradient Background Accent */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isOfficial && "bg-linear-to-br from-primary-50/50 to-transparent dark:from-primary-950/20",
                  isParallel && "bg-linear-to-br from-amber-50/50 to-transparent dark:from-amber-950/20",
                  isCreditCard && "bg-linear-to-br from-slate-50/50 to-transparent dark:from-slate-950/20"
                )} />

                {/* Content */}
                <div className="relative">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          isOfficial && "bg-primary-500",
                          isParallel && "bg-amber-500",
                          isCreditCard && "bg-slate-500"
                        )} />
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {scenario.label}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                    {isParallel && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        {t.pages.currencies.popular}
                      </span>
                    )}
                    {isOfficial && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700">
                        {t.pages.currencies.official}
                      </span>
                    )}
                  </div>

                  {/* Amount Display */}
                  <div className="space-y-3">
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {scenario.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {getCurrencyInfo(targetCurrency).name}
                    </p>

                    {/* Exchange Rate Badge */}
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        1 {getCurrencyInfo(sourceCurrency).name} = {scenario.rate.toFixed(2)} {getCurrencyInfo(targetCurrency).name}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
