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
              "bg-panel2",
              "shadow-sm hover:shadow-md",
              "border border-line",
              "hover:border-gold-line",
              "transition-all",
              "focus:outline-none focus:ring-2 focus:ring-gold/20"
            )}
          >
            <span className="text-lg" role="img" aria-label={currencyInfo.name}>
              {currencyInfo.flag}
            </span>
            <span className="font-semibold text-sm text-text">
              {currencyInfo.code}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted" />
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
                <span className="text-xs text-muted">{currency.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-8">
      {/* Horizontal Calculator Layout (form) */}
      <div className="card-surface p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          {/* FROM Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-muted mb-2 px-1">
              {t.currency.from} / From
            </label>
            <div className="stat-tile p-5">
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
                  "num w-full text-4xl md:text-5xl font-bold mt-3",
                  "bg-transparent border-0",
                  "focus:outline-none focus:ring-0",
                  "text-text",
                  "placeholder:text-dim"
                )}
              />
              <p className="text-xs text-muted mt-2 font-medium">
                {getCurrencyInfo(sourceCurrency).name}
              </p>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center lg:mt-8">
            <button
              onClick={handleSwap}
              className={cn(
                "rounded-2xl bg-gold",
                "shadow-gold hover:shadow-lg",
                "p-4 transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-4 focus:ring-gold/30",
                "rotate-0 lg:rotate-90"
              )}
              aria-label="Swap currencies"
            >
              <ArrowUpDown className="h-6 w-6 text-on-gold" />
            </button>
          </div>

          {/* TO Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-muted mb-2 px-1">
              {t.currency.to} / To
            </label>
            <div className="stat-tile p-5">
              <CurrencySelector
                value={targetCurrency}
                onChange={setTargetCurrency}
                excludeCurrency={sourceCurrency}
              />
              <div className="num w-full text-4xl md:text-5xl font-bold mt-3 text-text">
                {scenarios[0]?.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </div>
              <p className="text-xs text-muted mt-2 font-medium">
                {getCurrencyInfo(targetCurrency).name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - primary official result highlighted, others secondary */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2">
          <div className="h-1 w-1 rounded-full bg-gold"></div>
          <h3 className="text-sm font-semibold text-muted">
            {t.currency.exchangeMethods}
          </h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gold">
              <div className="w-3 h-3 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
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

            return (
              <div
                key={scenario.label}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-6 transition-shadow",
                  isOfficial
                    ? "bg-gold-soft shadow-gold"
                    : "card-surface hover:shadow-gold"
                )}
              >
                <div className="relative">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn('w-2 h-2 rounded-full', isOfficial ? 'bg-gold' : 'bg-dim')} />
                        <h4 className="font-heading text-base font-bold text-text">
                          {scenario.label}
                        </h4>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                    {isParallel && (
                      <span className="chip">
                        {t.pages.currencies.popular}
                      </span>
                    )}
                    {isOfficial && (
                      <span className="chip bg-gold text-on-gold">
                        {t.pages.currencies.official}
                      </span>
                    )}
                  </div>

                  {/* Amount Display */}
                  <div className={cn('space-y-3', isOfficial && 'border-t border-gold-line pt-4')}>
                    <p className={cn('num font-bold tracking-tight', isOfficial ? 'text-4xl text-gold' : 'text-3xl text-text')}>
                      {scenario.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-muted font-medium">
                      {getCurrencyInfo(targetCurrency).name}
                    </p>

                    {/* Exchange Rate Badge */}
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-panel2">
                      <p className="num text-xs text-muted font-medium">
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
