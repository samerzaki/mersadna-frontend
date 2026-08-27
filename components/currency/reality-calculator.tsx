"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  CurrencyCode,
  calculateConversionScenarios,
  getAverageOfficialRate,
  MARKET_PULSE,
} from "@/lib/mock-currency-data";
import { useLanguage } from "@/contexts/language-context";

export function RealityCalculator() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [isReversed, setIsReversed] = useState(false); // false = Currency -> EGP, true = EGP -> Currency

  const numericAmount = parseFloat(amount) || 0;

  // Calculate the 3 realities
  const realities = useMemo(() => {
    if (!isReversed) {
      // Currency -> EGP
      const officialRate = getAverageOfficialRate(fromCurrency).sell;
      const parallelRate = MARKET_PULSE.parallel.sell;
      const cardRate = officialRate * 1.1; // 10% markup

      return [
        {
          label: "الرسمي / Official",
          labelEn: "Official / Bank",
          context: "لو هتدفع في البنك",
          contextEn: "If paying at bank",
          amount: numericAmount * officialRate,
          rate: officialRate,
        },
        {
          label: "السوق الموازي / Parallel Market",
          labelEn: "Parallel Market",
          context: "السوق الموازي",
          contextEn: "Parallel market rate",
          amount: numericAmount * parallelRate,
          rate: parallelRate,
          highlighted: true,
        },
        {
          label: "مشتريات فيزا / Card Spending",
          labelEn: "Card Spending",
          context: "دفع بالفيزا (شامل 10% تدبير)",
          contextEn: "Visa payment (includes 10% markup)",
          amount: numericAmount * cardRate,
          rate: cardRate,
        },
      ];
    } else {
      // EGP -> Currency (reverse)
      const officialRate = getAverageOfficialRate(fromCurrency).buy;
      const parallelRate = MARKET_PULSE.parallel.buy;
      const cardRate = officialRate * 1.1;

      return [
        {
          label: "الرسمي / Official",
          labelEn: "Official / Bank",
          context: "لو هتدفع في البنك",
          contextEn: "If paying at bank",
          amount: numericAmount / officialRate,
          rate: officialRate,
        },
        {
          label: "السوق الموازي / Parallel Market",
          labelEn: "Parallel Market",
          context: "السوق الموازي",
          contextEn: "Parallel market rate",
          amount: numericAmount / parallelRate,
          rate: parallelRate,
          highlighted: true,
        },
        {
          label: "مشتريات فيزا / Card Spending",
          labelEn: "Card Spending",
          context: "دفع بالفيزا (شامل 10% تدبير)",
          contextEn: "Visa payment (includes 10% markup)",
          amount: numericAmount / cardRate,
          rate: cardRate,
        },
      ];
    }
  }, [numericAmount, fromCurrency, isReversed]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Input Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        {/* Large Amount Input */}
        <div className="flex-1 w-full">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className={cn(
              "w-full text-4xl md:text-5xl lg:text-6xl font-bold",
              "bg-transparent border-0 border-b-4 border-slate-300 dark:border-slate-700",
              "focus:border-primary-500 dark:focus:border-primary-400",
              "focus:outline-none transition-colors",
              "text-slate-900 dark:text-slate-100",
              "pb-2 text-center md:text-right",
              "tabular-nums"
            )}
          />
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReversed(false)}
            className={cn(
              "px-6 py-4 rounded-full text-xl font-semibold transition-all",
              !isReversed
                ? "bg-primary text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {fromCurrency} {fromCurrency === 'USD' ? '🇺🇸' : fromCurrency === 'EUR' ? '🇪🇺' : fromCurrency === 'SAR' ? '🇸🇦' : fromCurrency === 'AED' ? '🇦🇪' : fromCurrency === 'KWD' ? '🇰🇼' : fromCurrency === 'GBP' ? '🇬🇧' : ''}
          </button>
          <span className="text-2xl text-slate-400">→</span>
          <button
            onClick={() => setIsReversed(true)}
            className={cn(
              "px-6 py-4 rounded-full text-xl font-semibold transition-all",
              isReversed
                ? "bg-primary text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            EGP 🇪🇬
          </button>
        </div>
      </div>

      {/* Currency Picker */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(['USD', 'EUR', 'SAR', 'AED', 'KWD', 'GBP'] as CurrencyCode[]).map((currency) => (
          <button
            key={currency}
            onClick={() => setFromCurrency(currency)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all",
              fromCurrency === currency
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {currency}
          </button>
        ))}
      </div>

      {/* The 3 Realities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {realities.map((reality, index) => (
          <div
            key={index}
            className={cn(
              "rounded-xl border-2 p-6 transition-all",
              reality.highlighted
                ? "border-primary bg-primary-50 dark:bg-primary-950/20 shadow-lg"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            )}
          >
            {/* Label */}
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {reality.label}
            </h3>

            {/* Amount - Large */}
            <div className="mb-3">
              <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {reality.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isReversed ? fromCurrency : 'EGP'}
              </p>
            </div>

            {/* Context */}
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {reality.context}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
