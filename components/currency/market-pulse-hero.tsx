"use client";

import React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKET_PULSE, calculateGapPercentage, getAverageOfficialRate } from "@/lib/mock-currency-data";
import { useLanguage } from "@/contexts/language-context";

export function MarketPulseHero() {
  const { t } = useLanguage();
  const gapPercentage = calculateGapPercentage();
  const officialAvg = getAverageOfficialRate('USD');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Card 1: Parallel Market - Highlighted */}
      <div className="relative overflow-hidden rounded-xl border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-6 shadow-lg">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
        
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
              {t.pages.currencies.parallelMarket}
            </h3>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-800">
            <TrendingUp className="h-4 w-4 text-amber-700 dark:text-amber-300" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-100">
              {t.pages.currencies.hot}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Buy/Sell Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 dark:bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">
                {t.gold.buyPrice}
              </p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {MARKET_PULSE.parallel.buy.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/60 dark:bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">
                {t.gold.sellPrice}
              </p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {MARKET_PULSE.parallel.sell.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Gap Indicator */}
          <div className="flex items-center justify-between bg-white/60 dark:bg-secondary/50 rounded-lg p-3">
            <div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-0.5">
                {t.pages.currencies.gapVsOfficial}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-5 w-5 text-red-600" />
              <span className="text-xl font-bold text-red-600">
                +{gapPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: USDT */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.pages.currencies.digitalDollar}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">₮</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Buy/Sell Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t.gold.buyPrice}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {MARKET_PULSE.usdt.buy.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t.gold.sellPrice}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {MARKET_PULSE.usdt.sell.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 24h Change */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">
                {t.pages.currencies.change24h}
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-1",
              MARKET_PULSE.usdt.change24h < 0 ? "text-red-600" : "text-green-600"
            )}>
              {MARKET_PULSE.usdt.change24h < 0 ? (
                <ArrowDownRight className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
              <span className="text-xl font-bold">
                {MARKET_PULSE.usdt.change24h > 0 ? '+' : ''}
                {MARKET_PULSE.usdt.change24h.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Official Average */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.pages.currencies.officialAverage}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">$</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Buy/Sell Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t.gold.buyPrice}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {officialAvg.buy.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {t.gold.sellPrice}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {officialAvg.sell.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
            <p className="text-xs text-primary-700 dark:text-primary-400 text-center">
              {t.pages.currencies.averageOfBanks} {MARKET_PULSE.parallel.buy > officialAvg.buy ? '10' : '8'} {t.pages.currencies.bankLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
