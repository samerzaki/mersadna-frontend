"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  CurrencyCode,
  Bank,
} from "@/lib/mock-currency-data";
import { useCurrencyBanks } from '@/hooks/use-currency-prices';
import { useLanguage } from "@/contexts/language-context";
import { SectionCard } from "@/components/ui/section-card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { BankBadge } from "@/components/ui/bank-badge";
import { Sparkline } from "@/components/ui/sparkline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { localizedText } from '@/lib/localized-text';

interface InitialBankData {
  banks: Array<{
    id: number;
    code: string;
    name: string;
    bank_logo_url: string;
  latest_buy_rate: number;
  latest_sell_rate: number;
  is_live: boolean;
  last_checked_at_for_human: string;
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
  const { t, language } = useLanguage();
  const tableDirection = language === 'ar' ? 'rtl' : 'ltr';
  const valueAlignment = language === 'ar' ? 'right' : 'left';
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
      const stored = localStorage.getItem('odamak_pinned_banks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save pinned banks to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('odamak_pinned_banks', JSON.stringify(pinnedBanks));
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
    // Clear the previous currency's rows while the active currency loads.
    setBanks([]);

    // Use initialBankData for default currency
    if (hasInitialData && initialBankData) {
      const transformedBanks = initialBankData.banks.map(bank => ({
        id: bank.id.toString(),
        code: bank.code,
        name: localizedText(bank.name, language),
        logo: bank.bank_logo_url,
        isLive: bank.is_live,
        lastCheckedAtForHuman: bank.last_checked_at_for_human,
        rates: {
          [selectedCurrency]: {
            buy: bank.latest_buy_rate,
            sell: bank.latest_sell_rate,
            history: (bank.chart?.data ?? []).map(d => d.buy_rate),
          }
        }
      })) as Bank[];
      setBanks(transformedBanks);
    } else if (bankData?.success && bankData.data.banks) {
      const transformedBanks = bankData.data.banks.map(bank => ({
        id: bank.id.toString(),
        code: bank.code,
        name: localizedText(bank.name, language),
        logo: bank.bank_logo_url,
        isLive: bank.last_checked?.live ?? false,
        lastCheckedAtForHuman: bank.last_checked?.last_checked_at_for_human ?? '',
        rates: {
          [selectedCurrency]: {
            buy: bank.price.buy,
            sell: bank.price.sell,
            history: (bank.chart?.data ?? []).map(d => d.buy_rate),
          }
        }
      })) as Bank[];
      setBanks(transformedBanks);
    }
  }, [bankData, selectedCurrency, hasInitialData, initialBankData, language]);

  // Reset sort to default (buy desc) when currency changes
  useEffect(() => {
    setSortConfig({ key: 'buy', direction: 'desc' });
  }, [selectedCurrency]);

  // Handle sort column click
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      if (key === 'buy') return { key, direction: 'desc' };
      if (key === 'sell') return { key, direction: 'asc' };
      return { key, direction: 'asc' };
    });
  };

  // Sort banks based on sortConfig - Pinned banks first, then normal sort
  const sortedBanks = useMemo(() => {
    if (!banks.length) return [];

    const pinned = banks.filter((bank) => pinnedBanks.includes(bank.id));
    const unpinned = banks.filter((bank) => !pinnedBanks.includes(bank.id));

    const sortFn = (a: Bank, b: Bank) => {
      if (sortConfig.key === 'name') {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        return sortConfig.direction === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      } else if (sortConfig.key === 'buy') {
        const aRate = a.rates[selectedCurrency]?.buy || 0;
        const bRate = b.rates[selectedCurrency]?.buy || 0;
        return sortConfig.direction === 'desc' ? bRate - aRate : aRate - bRate;
      } else if (sortConfig.key === 'sell') {
        const aRate = a.rates[selectedCurrency]?.sell || 0;
        const bRate = b.rates[selectedCurrency]?.sell || 0;
        return sortConfig.direction === 'asc' ? aRate - bRate : bRate - aRate;
      }
      return 0;
    };

    const sortedPinned = [...pinned].sort(sortFn);
    const sortedUnpinned = [...unpinned].sort(sortFn);
    const combined = [...sortedPinned, ...sortedUnpinned];

    return limit ? combined.slice(0, limit) : combined;
  }, [banks, selectedCurrency, limit, sortConfig, pinnedBanks]);

  // Filter banks based on search term
  const filteredBanks = useMemo(() => {
    if (!searchTerm.trim()) return sortedBanks;
    const searchLower = searchTerm.toLowerCase().trim();
    return sortedBanks.filter(bank => bank.name.toLowerCase().includes(searchLower));
  }, [sortedBanks, searchTerm]);

  // Get best rates for highlighting (from all banks, not filtered)
  const bestBuy = useMemo(() => {
    if (!sortedBanks.length) return { bank: null as any, rate: 0 };
    const best = sortedBanks.reduce((prev, current) => {
      const prevRate = prev.rates[selectedCurrency]?.buy || 0;
      const currentRate = current.rates[selectedCurrency]?.buy || 0;
      return currentRate > prevRate ? current : prev;
    });
    return { bank: best, rate: best.rates[selectedCurrency]?.buy || 0 };
  }, [sortedBanks, selectedCurrency]);

  const bestSell = useMemo(() => {
    if (!sortedBanks.length) return { bank: null as any, rate: 0 };
    const best = sortedBanks.reduce((prev, current) => {
      const prevRate = prev.rates[selectedCurrency]?.sell || Infinity;
      const currentRate = current.rates[selectedCurrency]?.sell || Infinity;
      return currentRate < prevRate ? current : prev;
    });
    return { bank: best, rate: best.rates[selectedCurrency]?.sell || 0 };
  }, [sortedBanks, selectedCurrency]);

  const segmentedItems = CURRENCIES.map((c) => ({ value: c, label: currencyNames[c], mono: c }));

  return (
    <SectionCard
      title={showTabs ? undefined : `${t.currency.banksTitle} — ${selectedCurrency}`}
      padded={false}
      className="overflow-hidden"
    >
      {showTabs && (
        <div className="card-header-row flex-wrap gap-3">
          <SegmentedControl items={segmentedItems} value={selectedCurrency} onChange={(v) => setSelectedCurrency(v as CurrencyCode)} />
        </div>
      )}

      {/* Search Input - only show if no external searchTerm */}
      {externalSearchTerm === undefined && (
        <div className="px-5 pt-4">
          <input
            type="text"
            placeholder={t.currency.searchBank}
            value={internalSearchTerm}
            onChange={(e) => setInternalSearchTerm(e.target.value)}
            className="w-full h-10 px-3.5 rounded-[11px] border border-line bg-bg text-[13px] text-text placeholder:text-dim focus:border-gold focus:outline-none"
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted text-sm">{t.currency.loadingRates}</div>
      ) : error ? (
        <div className="flex items-center justify-center py-16 text-down text-sm">{error}</div>
      ) : !banks.length ? (
        <div className="flex items-center justify-center py-16 text-muted text-sm">{t.currency.noDataAvailable}</div>
      ) : (
        <div className="overflow-x-auto" dir={tableDirection}>
          <div className="min-w-[560px]" dir={tableDirection}>
            <div
              className="hidden md:grid items-center px-[22px] py-3.5 bg-panel2 text-[12px] text-muted"
              style={{ gridTemplateColumns: '2.25fr 1fr 1fr 0.7fr', direction: tableDirection }}
            >
              <button onClick={() => handleSort('name')} className="text-start cursor-pointer hover:text-text transition-colors">
                {t.currency.bankNameColumn} — {selectedCurrency}
              </button>
              <button onClick={() => handleSort('buy')} className="cursor-pointer hover:text-text transition-colors" style={{ textAlign: valueAlignment }}>
                {t.currency.highestBuyPrice}
              </button>
              <button onClick={() => handleSort('sell')} className="cursor-pointer hover:text-text transition-colors" style={{ textAlign: valueAlignment }}>
                {t.currency.lowestSellPrice}
              </button>
              <span style={{ textAlign: valueAlignment }}>{language === 'ar' ? 'آخر 30 يوم' : 'Last 30d'}</span>
            </div>

            {filteredBanks.length === 0 && searchTerm ? (
              <div className="text-center py-10 text-muted text-sm">{t.currency.noSearchResults}</div>
            ) : (
              filteredBanks.map((bank) => {
                const bankRate = bank.rates[selectedCurrency];
                if (!bankRate) return null;

                const isBestBuy = bank.id === bestBuy.bank?.id;
                const isBestSell = bank.id === bestSell.bank?.id;
                const isPinned = pinnedBanks.includes(bank.id);

                return (
                  <div
                    key={bank.id}
                    className="grid items-center gap-3 px-[22px] py-4 border-t border-[var(--line2)] hover:bg-hover transition-colors"
                    style={{ gridTemplateColumns: '2.25fr 1fr 1fr 0.7fr', direction: tableDirection }}
                  >
                    <div className="flex items-center gap-3 min-w-0" dir={tableDirection}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(bank.id);
                        }}
                        className="shrink-0 p-1 rounded hover:bg-panel2 transition-colors"
                        aria-label={isPinned ? t.currency.unpinAria : t.currency.pinAria}
                      >
                        <Pin className={cn('h-3.5 w-3.5 transition-all', isPinned ? 'fill-gold text-gold rotate-45' : 'text-dim')} />
                      </button>
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                'h-2 w-2 shrink-0 rounded-full animate-pulse cursor-help',
                                bank.isLive ? 'bg-emerald-500' : 'bg-red-500'
                              )}
                              aria-label={bank.isLive ? 'Live rate' : 'Inactive rate'}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="!bg-black !text-white">
                            {bank.lastCheckedAtForHuman || (bank.isLive ? 'Live rate' : 'Inactive rate')}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <BankBadge name={bank.name} logoUrl={bank.logo?.startsWith('http') ? bank.logo : undefined} size={34} />
                      <span className="text-[14px] text-text truncate">
                        {bank.name}{bank.code ? ` (${bank.code.toUpperCase()})` : ''}
                      </span>
                    </div>
                    <span className={cn('num text-[15px]', isBestBuy ? 'text-up' : 'text-text')} dir="ltr" style={{ textAlign: valueAlignment }}>
                      {Number(bankRate.buy ?? 0).toFixed(2)}
                    </span>
                    <span className={cn('num text-[15px]', isBestSell ? 'text-down' : 'text-text')} dir="ltr" style={{ textAlign: valueAlignment }}>
                      {Number(bankRate.sell ?? 0).toFixed(2)}
                    </span>
                    <span className={`flex ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                      {bankRate.history && bankRate.history.length > 1 && (
                        <Sparkline data={bankRate.history} width={56} height={20} />
                      )}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
