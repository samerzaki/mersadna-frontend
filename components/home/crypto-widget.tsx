'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { formatPriceWithCurrency, formatPercent } from '@/lib/format';
import type { CryptoPrice } from '@/types';

interface CryptoWidgetClientProps {
  cryptos: CryptoPrice[];
}

export function CryptoWidgetClient({ cryptos }: CryptoWidgetClientProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <section className="flex flex-col w-full">
      {/* Section Header */}
      <div className="mb-4">
        <Link href="/crypto" className="group">
          <h2 className="text-2xl font-bold flex items-center gap-2 transition-colors group-hover:text-primary">

            <Bitcoin className="h-6 w-6 text-orange-500" />
            {isRTL ? 'العملات الرقمية' : 'Crypto'}

          </h2>
        </Link>
      </div>

      {/* Crypto Card */}
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-slate-100 dark:border-border overflow-hidden flex-1 flex flex-col">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 dark:border-border bg-slate-50/80 dark:bg-secondary">
          <span className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
            {isRTL ? 'أعلى 3 عملات' : 'Top 3 Coins'}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">
              {isRTL ? 'مباشر' : 'Live'}
            </span>
          </div>
        </div>

        {/* Crypto List */}
        <div className="divide-y divide-slate-100 dark:divide-border flex-1">
          {cryptos && cryptos.length > 0 ? (
            cryptos.map((crypto) => {
              const isPositive = crypto.change_24h >= 0;
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;

              return (
                <div
                  key={crypto.id}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-secondary transition-colors"
                >
                  {/* Coin Image */}
                  {crypto.image ? (
                    <img
                      src={crypto.image}
                      alt={crypto.symbol}
                      className="h-10 w-10 rounded-full shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shrink-0">
                      {crypto.symbol.substring(0, 1)}
                    </div>
                  )}

                  {/* Name & Symbol */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {crypto.symbol}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {isRTL ? (crypto.nameAr || crypto.name) : crypto.name}
                    </p>
                  </div>

                  {/* Price & Change */}
                  <div className="text-end shrink-0">
                    <p dir="ltr" className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums text-left">
                      {formatPriceWithCurrency(crypto.price_usd, 'USD', 'en-US')}
                    </p>
                    <div dir="ltr" className="flex items-center gap-1 justify-start">
                      <TrendIcon
                        className={`h-3 w-3 ${
                          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatPercent(crypto.change_24h)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {isRTL ? 'لا توجد بيانات' : 'No data available'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
