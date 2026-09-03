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
import { PageHeader } from '@/components/ui/page-header';

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
              "bg-panel2",
              "shadow-sm hover:shadow-md",
              "border border-line",
              "hover:border-gold-line",
              "transition-all",
              "focus:outline-none focus:ring-2 focus:ring-gold/20"
            )}
          >
            {selected?.image ? (
              <img src={selected.image} alt={selected.symbol} className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gold-soft" />
            )}
            <span className="font-semibold text-sm text-text">
              {value}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted" />
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
                <div className="w-5 h-5 rounded-full bg-gold-soft" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{crypto.symbol}</span>
                <span className="text-xs text-muted">
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
          <div className="h-9 w-64 bg-panel2 rounded-lg animate-pulse" />
        </section>
        <div className="card-surface p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            <div className="flex-1 w-full">
              <div className="h-4 w-16 bg-panel2 rounded animate-pulse mb-2" />
              <div className="stat-tile p-5">
                <div className="h-8 w-24 bg-panel rounded-full animate-pulse" />
                <div className="h-12 w-full bg-panel rounded animate-pulse mt-3" />
                <div className="h-4 w-32 bg-panel rounded animate-pulse mt-2" />
              </div>
            </div>
            <div className="h-14 w-14 bg-gold-soft rounded-2xl animate-pulse" />
            <div className="flex-1 w-full">
              <div className="h-4 w-16 bg-panel2 rounded animate-pulse mb-2" />
              <div className="stat-tile p-5">
                <div className="h-8 w-24 bg-panel rounded-full animate-pulse" />
                <div className="h-12 w-full bg-panel rounded animate-pulse mt-3" />
                <div className="h-4 w-32 bg-panel rounded animate-pulse mt-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 card-surface animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!cryptos || cryptos.length === 0) {
    return (
      <div className="max-w-6xl">
        <p className="text-center text-muted">
          {isRTL ? 'لا توجد بيانات متاحة' : 'No data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        eyebrow={isRTL ? 'الحاسبات' : 'Calculators'}
        title={isRTL ? 'حاسبة العملات الرقمية' : 'Crypto Calculator'}
      />

      {/* Horizontal Calculator Layout */}
      <div className="card-surface p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          {/* FROM Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-muted mb-2 px-1">
              {isRTL ? 'من' : 'From'}
            </label>
            <div className="stat-tile p-5">
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
                  "num w-full text-4xl md:text-5xl font-bold mt-3",
                  "bg-transparent border-0",
                  "focus:outline-none focus:ring-0",
                  "text-text",
                  "placeholder:text-dim"
                )}
              />
              <p className="text-xs text-muted mt-2 font-medium">
                {isRTL ? (fromCryptoData?.nameAr || fromCryptoData?.name) : fromCryptoData?.name}
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
              aria-label="Swap cryptocurrencies"
            >
              <ArrowUpDown className="h-6 w-6 text-on-gold" />
            </button>
          </div>

          {/* TO Section */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-muted mb-2 px-1">
              {isRTL ? 'إلى' : 'To'}
            </label>
            <div className="stat-tile p-5">
              <CryptoSelector
                value={toCrypto}
                onChange={setToCrypto}
                excludeSymbol={fromCrypto}
              />
              <div className="num w-full text-4xl md:text-5xl font-bold mt-3 text-text">
                {result !== null
                  ? result >= 1
                    ? result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
                  : '0.00'}
              </div>
              <p className="text-xs text-muted mt-2 font-medium">
                {isRTL ? (toCryptoData?.nameAr || toCryptoData?.name) : toCryptoData?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2">
          <div className="h-1 w-1 rounded-full bg-gold"></div>
          <h3 className="text-sm font-semibold text-muted">
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
                className="card-surface p-6 transition-shadow hover:shadow-gold"
              >
                <div className="relative">
                  {/* Header with Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-gold" />
                        <h4 className="font-heading text-base font-bold text-text">
                          {card.label}
                        </h4>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    <span className={cn(
                      "chip",
                      isThird && card.isPositive !== undefined
                        ? card.isPositive
                          ? "bg-up-soft text-up"
                          : "bg-down-soft text-down"
                        : "bg-gold-soft text-gold"
                    )}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Value Display */}
                  <div className="space-y-3">
                    <p className={cn(
                      "num text-4xl font-bold tracking-tight",
                      isThird && card.isPositive !== undefined
                        ? card.isPositive
                          ? "text-up"
                          : "text-down"
                        : "text-text"
                    )}>
                      {card.value}
                    </p>

                    {/* Rate Badge */}
                    {isFirst && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel2">
                        <DollarSign className="h-3 w-3 text-muted" />
                        <p className="num text-xs text-muted font-medium">
                          1 {fromCrypto} = ${(fromCryptoData?.price_usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                    {isSecond && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel2">
                        <ArrowLeftRight className="h-3 w-3 text-muted" />
                        <p className="num text-xs text-muted font-medium">
                          1 {fromCrypto} = {card.value} {toCrypto}
                        </p>
                      </div>
                    )}
                    {isThird && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel2">
                        {card.isPositive ? (
                          <TrendingUp className="h-3 w-3 text-up" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-down" />
                        )}
                        <p className="text-xs text-muted font-medium">
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
      <div className="text-center text-xs text-muted">
        {isRTL
          ? 'الأسعار تقريبية وللأغراض التوضيحية فقط. قد تختلف الأسعار الفعلية.'
          : 'Prices are approximate and for demonstration purposes only. Actual prices may vary.'}
      </div>
    </div>
  );
}
