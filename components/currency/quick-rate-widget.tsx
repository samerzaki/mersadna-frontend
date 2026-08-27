"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { MARKET_PULSE, getAverageOfficialRate } from "@/lib/mock-currency-data";

/**
 * Quick Rate Widget
 * Compact widget showing USD rates at a glance
 * Can be used in sidebars, footers, or as a floating element
 */
export function QuickRateWidget() {
  const officialUSD = getAverageOfficialRate('USD');

  return (
    <div className="bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-900 dark:to-primary-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            أسعار الدولار
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            USD Live Rates
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Rates Grid */}
      <div className="space-y-2">
        {/* Official Rate */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            رسمي
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
              {officialUSD.buy.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">EGP</span>
          </div>
        </div>

        {/* Parallel Rate */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            موازي
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {MARKET_PULSE.parallel.buy.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">EGP</span>
          </div>
        </div>

        {/* USDT Rate */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            USDT
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              {MARKET_PULSE.usdt.buy.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">EGP</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

      {/* Gap Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-600 dark:text-slate-400">
          الفارق / Gap
        </span>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
          <ArrowUpRight className="h-3 w-3 text-red-600 dark:text-red-400" />
          <span className="text-xs font-bold text-red-700 dark:text-red-400">
            +{(((MARKET_PULSE.parallel.buy - officialUSD.buy) / officialUSD.buy) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Link to Full Dashboard */}
      <Link
        href="/currencies"
        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors"
      >
        <span>عرض التفاصيل</span>
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}

/**
 * Compact version for tight spaces (e.g., header)
 */
export function QuickRateWidgetCompact() {
  const officialUSD = getAverageOfficialRate('USD');

  return (
    <Link
      href="/currencies"
      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          USD
        </span>
      </div>
      
      <div className="flex items-center gap-3 text-xs">
        <div className="flex flex-col items-end">
          <span className="text-primary-700 dark:text-primary-400 font-bold">
            {officialUSD.buy.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500">رسمي</span>
        </div>
        
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
        
        <div className="flex flex-col items-end">
          <span className="text-amber-700 dark:text-amber-400 font-bold">
            {MARKET_PULSE.parallel.buy.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500">موازي</span>
        </div>
      </div>
      
      <ExternalLink className="h-3 w-3 text-slate-400" />
    </Link>
  );
}
