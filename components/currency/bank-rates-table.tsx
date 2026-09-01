"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Pin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  CurrencyCode,
  Bank,
} from "@/lib/mock-currency-data";
import { useCurrencyBanks } from '@/hooks/use-currency-prices';
import { useLanguage } from "@/contexts/language-context";
import { Sparkline } from "./sparkline";

interface InitialBankData {
  banks: Array<{
    id: number;
    name: string;
    bank_logo_url: string;
    latest_buy_rate: number;
    latest_sell_rate: number;
    chart: { data: Array<{ buy_rate: number }> };
  }>;
}

interface BankRatesTableProps {
  limit?: number; // Optional: show only top N banks
  showTabs?: boolean; // Optional: show currency tabs
  selectedCurrency?: CurrencyCode; // Optional: external currency state
  onCurrencyChange?: (currency: CurrencyCode) => void; // Optional: callback for currency changes
  searchTerm?: string; // Optional: external search term
  initialBankData?: InitialBankData; // Optional: server-fetched bank data for default currency
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export function BankRatesTable({
  limit,
  showTabs = true,
  selectedCurrency: externalCurrency,
  onCurrencyChange,
  searchTerm: externalSearchTerm,
  initialBankData
}: BankRatesTableProps) {
  const { t } = useLanguage();
  const [internalCurrency, setInternalCurrency] = useState<CurrencyCode>('USD');

  // Use external currency if provided, otherwise use internal state
  const selectedCurrency = externalCurrency ?? internalCurrency;

  const setSelectedCurrency = (currency: CurrencyCode) => {
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    } else {
      setInternalCurrency(currency);
    }
  };
  const [banks, setBanks] = useState<Bank[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'buy',
    direction: 'desc', // Default: Highest buy price first
  });
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const searchTerm = externalSearchTerm ?? internalSearchTerm;

  // Currency names from translations
  const currencyNames: Record<CurrencyCode, string> = {
    'USD': t.currency.usdName,
    'EUR': t.currency.eurName,
    'SAR': t.currency.sarName,
    'AED': t.currency.aedName,
    'KWD': t.currency.kwdName,
    'GBP': t.currency.gbpName,
  };

  // Use initialBankData for default currency when available, otherwise fetch from API
  const hasInitialData = !!initialBankData && selectedCurrency === 'USD';
  const { data: bankData, isLoading: hookLoading, error: fetchError } = useCurrencyBanks(
    selectedCurrency,
    'EGP',
    '24h',
    !hasInitialData
  );
  const loading = hasInitialData ? false : hookLoading;

  const error = fetchError ? 'Failed to load bank rates' : null;
  
  // Pinned banks state - Load from localStorage
  const [pinnedBanks, setPinnedBanks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('mersadna_pinned_banks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save pinned banks to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mersadna_pinned_banks', JSON.stringify(pinnedBanks));
      } catch (err) {
        console.error('Failed to save pinned banks:', err);
      }
    }
  }, [pinnedBanks]);

  // Toggle pin status for a bank
  const togglePin = (bankId: string) => {
    setPinnedBanks((prev) => {
      if (prev.includes(bankId)) {
        return prev.filter((id) => id !== bankId);
      } else {
        return [...prev, bankId];
      }
    });
  };

  // Transform API data or initialBankData to component format
  useEffect(() => {
    // Use initialBankData for default currency
    if (hasInitialData && initialBankData) {
      const transformedBanks = initialBankData.banks.map(bank => ({
        id: bank.id.toString(),
        name: bank.name,
        logo: bank.bank_logo_url,
        rates: {
          [selectedCurrency]: {
            buy: bank.latest_buy_rate,
            sell: bank.latest_sell_rate,
            history: bank.chart.data.map(d => d.buy_rate),
          }
        }
      })) as Bank[];
      setBanks(transformedBanks);
    } else if (bankData?.success && bankData.data.banks) {
      const transformedBanks = bankData.data.banks.map(bank => ({
        id: bank.id.toString(),
        name: bank.name,
        logo: bank.bank_logo_url,
        rates: {
          [selectedCurrency]: {
            buy: bank.latest_buy_rate,
            sell: bank.latest_sell_rate,
            history: bank.chart.data.map(d => d.buy_rate),
          }
        }
      })) as Bank[];
      setBanks(transformedBanks);
    }
  }, [bankData, selectedCurrency, hasInitialData, initialBankData]);

  // Reset sort to default (buy desc) when currency changes
  useEffect(() => {
    setSortConfig({ key: 'buy', direction: 'desc' });
  }, [selectedCurrency]);

  // Handle sort column click
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      // If clicking the same column, toggle direction
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // If clicking a different column, set default direction based on column type
      if (key === 'buy') {
        return { key, direction: 'desc' }; // Highest first
      } else if (key === 'sell') {
        return { key, direction: 'asc' }; // Lowest first
      } else {
        return { key, direction: 'asc' }; // Alphabetical A-Z
      }
    });
  };

  // Sort banks based on sortConfig - Pinned banks first, then normal sort
  const sortedBanks = useMemo(() => {
    if (!banks.length) return [];
    
    // Separate pinned and unpinned banks
    const pinned = banks.filter((bank) => pinnedBanks.includes(bank.id));
    const unpinned = banks.filter((bank) => !pinnedBanks.includes(bank.id));
    
    // Sort function
    const sortFn = (a: Bank, b: Bank) => {
      if (sortConfig.key === 'name') {
        // Alphabetical sort by bank name
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (sortConfig.direction === 'asc') {
          return aName.localeCompare(bName);
        } else {
          return bName.localeCompare(aName);
        }
      } else if (sortConfig.key === 'buy') {
        // Sort by buy price
        const aRate = a.rates[selectedCurrency]?.buy || 0;
        const bRate = b.rates[selectedCurrency]?.buy || 0;
        return sortConfig.direction === 'desc' ? bRate - aRate : aRate - bRate;
      } else if (sortConfig.key === 'sell') {
        // Sort by sell price
        const aRate = a.rates[selectedCurrency]?.sell || 0;
        const bRate = b.rates[selectedCurrency]?.sell || 0;
        return sortConfig.direction === 'asc' ? aRate - bRate : bRate - aRate;
      }
      return 0;
    };
    
    // Sort both groups
    const sortedPinned = [...pinned].sort(sortFn);
    const sortedUnpinned = [...unpinned].sort(sortFn);
    
    // Combine: pinned first, then unpinned
    const combined = [...sortedPinned, ...sortedUnpinned];
    
    return limit ? combined.slice(0, limit) : combined;
  }, [banks, selectedCurrency, limit, sortConfig, pinnedBanks]);

  // Filter banks based on search term
  const filteredBanks = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedBanks;
    }
    const searchLower = searchTerm.toLowerCase().trim();
    return sortedBanks.filter(bank =>
      bank.name.toLowerCase().includes(searchLower)
    );
  }, [sortedBanks, searchTerm]);

  // Get best rates for highlighting (from all banks, not filtered)
  const bestBuy = useMemo(() => {
    if (!sortedBanks.length) return { bank: null as any, rate: 0 };
    const best = sortedBanks.reduce((prev, current) => {
      const prevRate = prev.rates[selectedCurrency]?.buy || 0;
      const currentRate = current.rates[selectedCurrency]?.buy || 0;
      return currentRate > prevRate ? current : prev;
    });
    return {
      bank: best,
      rate: best.rates[selectedCurrency]?.buy || 0,
    };
  }, [sortedBanks, selectedCurrency]);

  const bestSell = useMemo(() => {
    if (!sortedBanks.length) return { bank: null as any, rate: 0 };
    const best = sortedBanks.reduce((prev, current) => {
      const prevRate = prev.rates[selectedCurrency]?.sell || Infinity;
      const currentRate = current.rates[selectedCurrency]?.sell || Infinity;
      return currentRate < prevRate ? current : prev;
    });
    return {
      bank: best,
      rate: best.rates[selectedCurrency]?.sell || 0,
    };
  }, [sortedBanks, selectedCurrency]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">Loading bank rates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!banks.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">No bank rates available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Currency Tabs */}
      {showTabs && (
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 pb-2 -mx-4 px-4 pt-2 md:static md:mx-0 md:px-0 md:pt-0">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max p-2">
              {CURRENCIES.map((currency) => (
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
            </div>
          </div>
        </div>
      )}

      {/* Search Input - only show if no external searchTerm */}
      {externalSearchTerm === undefined && (
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.currency.searchBank}
            value={internalSearchTerm}
            onChange={(e) => setInternalSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
          />
        </div>
      )}

      {/* Table Header - Desktop */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => handleSort('name')}
          className="col-span-5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer text-left"
        >
          {t.pages.currencies.bankLabel}
          {sortConfig.key === 'name' && (
            sortConfig.direction === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          )}
        </button>
        <button
          onClick={() => handleSort('buy')}
          className="col-span-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {t.gold.buyPrice}
          {sortConfig.key === 'buy' && (
            sortConfig.direction === 'desc' ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUp className="h-3 w-3" />
            )
          )}
        </button>
        <button
          onClick={() => handleSort('sell')}
          className="col-span-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {t.gold.sellPrice}
          {sortConfig.key === 'sell' && (
            sortConfig.direction === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          )}
        </button>
        <div className="col-span-1 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
          {t.gold.spread}
        </div>
      </div>

      {/* Bank Rows */}
      <div className="space-y-3">
        {filteredBanks.length === 0 && searchTerm ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            {t.currency.noSearchResults}
          </div>
        ) : (
          filteredBanks.map((bank, index) => {
          const bankRate = bank.rates[selectedCurrency];
          if (!bankRate) return null;
          
          const isBestBuy = bank.id === bestBuy.bank?.id;
          const isBestSell = bank.id === bestSell.bank?.id;
          const spread = bankRate.sell - bankRate.buy;
          const spreadPercentage = (spread / bankRate.buy) * 100;

          return (
            <div
              key={bank.id}
              className={cn(
                "rounded-lg border transition-all hover:shadow-md",
                isBestBuy || isBestSell
                  ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              )}
            >
              {/* Mobile Layout */}
              <div className="md:hidden p-4 space-y-3">
                {/* Bank Info */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {bank.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(bank.id);
                        }}
                        className={cn(
                          "shrink-0 p-1 rounded transition-all",
                          "hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                        aria-label={pinnedBanks.includes(bank.id) ? "Unpin bank" : "Pin bank"}
                      >
                        <Pin
                          className={cn(
                            "h-4 w-4 transition-all",
                            pinnedBanks.includes(bank.id)
                              ? "fill-primary-600 text-primary-600 rotate-45"
                              : "text-slate-400"
                          )}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      #{index + 1} {t.pages.currencies.bestPrice}
                    </p>
                  </div>
                  {(isBestBuy || isBestSell) && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold text-primary-700 dark:text-primary-400">
                        {isBestBuy && isBestSell ? t.currency.best : isBestBuy ? t.currency.highestBuyShort : t.currency.lowestSellShort}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rates Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-2">
                    <p className="text-[10px] text-green-700 dark:text-green-400 mb-0.5">{t.currency.buy}</p>
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-base font-bold tabular-nums",
                          isBestBuy
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-900 dark:text-slate-100"
                        )}
                      >
                        {bankRate.buy.toFixed(2)}
                      </p>
                      {bankRate.history && bankRate.history.length > 0 && (
                        <Sparkline
                          data={bankRate.history}
                          width={40}
                          height={16}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                      )}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-2">
                    <p className="text-[10px] text-red-700 dark:text-red-400 mb-0.5">{t.currency.sell}</p>
                    <p
                      className={cn(
                        "text-base font-bold tabular-nums",
                        isBestSell
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-900 dark:text-slate-100"
                      )}
                    >
                      {bankRate.sell.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2">
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">{t.currency.gap}</p>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {spreadPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center p-4">
                {/* Bank Info - Col 1-5 */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {bank.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(bank.id);
                        }}
                        className={cn(
                          "shrink-0 p-1 rounded transition-all",
                          "hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                        aria-label={pinnedBanks.includes(bank.id) ? "Unpin bank" : "Pin bank"}
                      >
                        <Pin
                          className={cn(
                            "h-4 w-4 transition-all",
                            pinnedBanks.includes(bank.id)
                              ? "fill-primary-600 text-primary-600 rotate-45"
                              : "text-slate-400"
                          )}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.currencies.rank} #{index + 1}
                    </p>
                  </div>
                  {(isBestBuy || isBestSell) && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold text-primary-700 dark:text-primary-400">
                        ★
                      </span>
                    </div>
                  )}
                </div>

                {/* Buy Rate - Col 6-8 */}
                <div className="col-span-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <p
                      className={cn(
                        "text-xl font-bold tabular-nums",
                        isBestBuy
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-900 dark:text-slate-100"
                      )}
                    >
                      {bankRate.buy.toFixed(2)}
                    </p>
                    {bankRate.history && bankRate.history.length > 0 && (
                      <Sparkline
                        data={bankRate.history}
                        width={60}
                        height={20}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Sell Rate - Col 9-11 */}
                <div className="col-span-3 text-center">
                  <p
                    className={cn(
                      "text-xl font-bold tabular-nums",
                      isBestSell
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-900 dark:text-slate-100"
                    )}
                  >
                    {bankRate.sell.toFixed(2)}
                  </p>
                </div>

                {/* Spread - Col 12 */}
                <div className="col-span-1 text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {spreadPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {t.pages.currencies.highestBuy}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {t.pages.currencies.lowestSell}
          </span>
        </div>
      </div>
    </div>
  );
}
