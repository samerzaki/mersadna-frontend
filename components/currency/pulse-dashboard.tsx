"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { calculateGapPercentage, MARKET_PULSE, CURRENCIES, CurrencyCode } from "@/lib/mock-currency-data";
import { ArrowRight } from "lucide-react";

// Mock parallel rates for other currencies (in real app, fetch from API)
const PARALLEL_RATES: Record<CurrencyCode, { buy: number; sell: number }> = {
  USD: MARKET_PULSE.parallel,
  EUR: { buy: 56.20, sell: 56.50 },
  SAR: { buy: 16.85, sell: 16.95 },
  AED: { buy: 17.20, sell: 17.30 },
  KWD: { buy: 205.50, sell: 206.00 },
  GBP: { buy: 80.20, sell: 80.60 },
};

export function PulseDashboard() {
  const gapPercentage = calculateGapPercentage();
  const topCurrencies: CurrencyCode[] = ['USD', 'EUR', 'SAR'];

  return (
    <div className="space-y-8">
      {/* Hero: The Gap */}
      <div className="bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-900 dark:to-primary-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            الفجوة / The Gap
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            الفرق بين السوق الرسمي والموازي
          </p>
        </div>

        {/* Gap Visual */}
        <div className="max-w-md mx-auto">
          {/* Progress Bar */}
          <div className="relative h-8 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(gapPercentage, 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                +{gapPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Gap Details */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">الرسمي / Official</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {MARKET_PULSE.official.sell.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">الموازي / Parallel</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {MARKET_PULSE.parallel.sell.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Rates - Top 3 Currencies (Parallel Only) */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
          أسعار سريعة / Quick Rates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCurrencies.map((currency) => {
            const rate = PARALLEL_RATES[currency];
            return (
              <div
                key={currency}
                className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {currency}
                </div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums mb-1">
                  {rate.sell.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  السوق الموازي / Parallel
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/currencies/banks"
          className="group relative overflow-hidden bg-primary hover:bg-primary-600 text-white rounded-xl p-8 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">مقارنة البنوك</h3>
            <p className="text-primary-100 text-sm mb-4">Compare Banks</p>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>عرض الجدول</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link
          href="/currencies/calculator"
          className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl p-8 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">الحاسبة</h3>
            <p className="text-amber-100 text-sm mb-4">Calculator</p>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>احسب الآن</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
