'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronDown, DollarSign, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/use-crypto-prices';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CryptoCalculatorPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { data, isLoading } = useCryptoPrices(1, 50);
  const cryptos = data?.cryptos;

  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('USDT');
  const [amount, setAmount] = useState('1');

  const numericAmount = parseFloat(amount) || 0;

  const fromCryptoData = cryptos?.find((c) => c.symbol === fromCrypto);
  const toCryptoData = cryptos?.find((c) => c.symbol === toCrypto);

  const result = useMemo(() => {
    if (!cryptos || !amount) return null;
    const fromPrice = fromCryptoData?.price_usd || 0;
    const toPrice = toCryptoData?.price_usd || 1;
    return (numericAmount * fromPrice) / toPrice;
  }, [amount, numericAmount, fromCryptoData, toCryptoData, cryptos]);

  const handleSwap = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Info cards data
  const infoCards = useMemo(() => {
    const fromPrice = fromCryptoData?.price_usd || 0;
    const toPrice = toCryptoData?.price_usd || 0;
    const usdValue = numericAmount * fromPrice;
    const change24h = fromCryptoData?.change_24h || 0;
    const exchangeRate = toPrice > 0 ? fromPrice / toPrice : 0;

    return [
      {
        label: isRTL ? 'القيمة بالدولار' : 'USD Value',
        description: isRTL ? 'القيمة الإجمالية بالدولار الأمريكي' : 'Total value in US Dollars',
        value: `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        badge: isRTL ? 'دولار' : 'USD',
        color: 'blue' as const,
      },
      {
        label: isRTL ? 'سعر الصرف' : 'Exchange Rate',
        description: isRTL
          ? `سعر صرف ${fromCrypto} مقابل ${toCrypto}`
          : `${fromCrypto} to ${toCrypto} rate`,
        value: exchangeRate > 0
          ? exchangeRate >= 1
            ? exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
          : '0.00',
        badge: isRTL ? 'معدل' : 'Rate',
        color: 'amber' as const,
      },
      {
        label: isRTL ? 'تغير 24 ساعة' : '24h Change',
        description: isRTL
          ? `تأثير تغير السعر على ${fromCrypto}`
          : `Price change impact on ${fromCrypto}`,
        value: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
        badge: change24h >= 0 ? (isRTL ? 'صاعد' : 'Up') : (isRTL ? 'هابط' : 'Down'),
        color: 'slate' as const,
        isPositive: change24h >= 0,
      },
    ];
  }, [numericAmount, fromCryptoData, toCryptoData, fromCrypto, toCrypto, isRTL]);

  // Crypto Selector Component
  const CryptoSelector = ({
    value,
    onChange,
    excludeSymbol,
  }: {
    value: string;
    onChange: (symbol: string) => void;
    excludeSymbol?: string;
  }) => {
    const selected = cryptos?.find((c) => c.symbol === value);
    const available = cryptos?.filter((c) => c.symbol !== excludeSymbol) || [];

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
            {selected?.image ? (
              <img src={selected.image} alt={selected.symbol} className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-primary-400 to-purple-500" />
            )}
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {value}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-72 overflow-y-auto">
          {available.map((crypto) => (
            <DropdownMenuItem
              key={crypto.id}
              onClick={() => onChange(crypto.symbol)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {crypto.image ? (
                <img src={crypto.image} alt={crypto.symbol} className="w-5 h-5 rounded-full" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-primary-400 to-purple-500" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{crypto.symbol}</span>
                <span className="text-xs text-muted-foreground">
                  {isRTL ? (crypto.nameAr || crypto.name) : crypto.name}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl space-y-6">
        <section>
          <div className="h-9 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </section>
        <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            <div className="flex-1 w-full">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-3" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2" />
              </div>
            </div>
            <div className="h-14 w-14 bg-primary-200 dark:bg-primary-900 rounded-2xl animate-pulse" />
            <div className="flex-1 w-full">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-3" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!cryptos || cryptos.length === 0) {
    return (
      <div className="max-w-6xl">
        <p className="text-center text-slate-600 dark:text-slate-400">
          {isRTL ? 'لا توجد بيانات متاحة' : 'No data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🪙</span>
          {isRTL ? 'حاسبة العملات الرقمية' : 'Crypto Calculator'}
        </h1>
      </section>

      {/* Horizontal Calculator Layout */}
      <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          {/* FROM Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
              {isRTL ? 'من' : 'From'}
            </label>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
              <CryptoSelector
                value={fromCrypto}
                onChange={setFromCrypto}
                excludeSymbol={toCrypto}
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
                {isRTL ? (fromCryptoData?.nameAr || fromCryptoData?.name) : fromCryptoData?.name}
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
              aria-label="Swap cryptocurrencies"
            >
              <ArrowUpDown className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* TO Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
              {isRTL ? 'إلى' : 'To'}
            </label>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
              <CryptoSelector
                value={toCrypto}
                onChange={setToCrypto}
                excludeSymbol={fromCrypto}
              />
              <div className="w-full text-4xl md:text-5xl font-bold mt-3 text-slate-900 dark:text-slate-100 tabular-nums">
                {result !== null
                  ? result >= 1
                    ? result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
                  : '0.00'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {isRTL ? (toCryptoData?.nameAr || toCryptoData?.name) : toCryptoData?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2">
          <div className="h-1 w-1 rounded-full bg-primary-500"></div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isRTL ? 'تفاصيل التحويل' : 'Conversion Details'}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {infoCards.map((card, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={card.label}
                className={cn(
                  "group relative overflow-hidden",
                  "bg-white dark:bg-slate-900",
                  "border-2 transition-all duration-300",
                  "rounded-2xl p-6",
                  "hover:shadow-xl hover:scale-[1.02]",
                  isFirst && "border-primary-200 dark:border-primary-900/50 hover:border-primary-400 dark:hover:border-primary-700",
                  isSecond && "border-amber-200 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-700",
                  isThird && "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                )}
              >
                {/* Gradient Background Accent */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isFirst && "bg-linear-to-br from-primary-50/50 to-transparent dark:from-primary-950/20",
                  isSecond && "bg-linear-to-br from-amber-50/50 to-transparent dark:from-amber-950/20",
                  isThird && "bg-linear-to-br from-slate-50/50 to-transparent dark:from-slate-950/20"
                )} />

                {/* Content */}
                <div className="relative">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          isFirst && "bg-primary-500",
                          isSecond && "bg-amber-500",
                          isThird && "bg-slate-500"
                        )} />
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {card.label}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                      isFirst && "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700",
                      isSecond && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
                      isThird && (card.isPositive !== undefined
                        ? card.isPositive
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700")
                    )}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Value Display */}
                  <div className="space-y-3">
                    <p className={cn(
                      "text-4xl font-bold tracking-tight tabular-nums",
                      isThird && card.isPositive !== undefined
                        ? card.isPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                        : "text-slate-900 dark:text-slate-100"
                    )}>
                      {card.value}
                    </p>

                    {/* Rate Badge */}
                    {isFirst && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        <DollarSign className="h-3 w-3 text-slate-500" />
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          1 {fromCrypto} = ${(fromCryptoData?.price_usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                    {isSecond && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        <ArrowLeftRight className="h-3 w-3 text-slate-500" />
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          1 {fromCrypto} = {card.value} {toCrypto}
                        </p>
                      </div>
                    )}
                    {isThird && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                        {card.isPositive ? (
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {isRTL ? 'آخر 24 ساعة' : 'Last 24 hours'} — {fromCrypto}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        {isRTL
          ? 'الأسعار تقريبية وللأغراض التوضيحية فقط. قد تختلف الأسعار الفعلية.'
          : 'Prices are approximate and for demonstration purposes only. Actual prices may vary.'}
      </div>
    </div>
  );
}
