'use client';

import { useGoldOverview } from '@/hooks/use-gold-prices';
import { useCurrencyAverages } from '@/hooks/use-currency-prices';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { formatPrice, formatPercent, formatRelativeTime, isPriceLive } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  className?: string;
}

export function PriceTicker({ className }: PriceTickerProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const { data: goldData, isLoading: goldLoading, dataUpdatedAt } = useGoldOverview();
  const { data: usdData, isLoading: usdLoading } = useCurrencyAverages('USD', 'EGP');
  const { data: eurData, isLoading: eurLoading } = useCurrencyAverages('EUR', 'EGP');

  const isLoading = goldLoading || usdLoading || eurLoading;

  if (isLoading) {
    return (
      <div className={cn(
        "bg-slate-900 dark:bg-slate-950 border-b border-slate-800",
        className
      )}>
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-36 flex-shrink-0 bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get gold 24k data
  const gold24 = goldData?.data?.gold?.['24'];
  const gold24Price = gold24?.sell_price;
  const gold24Change = gold24?.spread_percent || 0;
  const gold24RecordedAt = gold24?.recorded_at;

  // Get USD average
  const usdPrice = usdData?.data?.banks?.avg_buy_rate;
  const usdChange = 0; // API doesn't provide change for currency averages

  // Get EUR average
  const eurPrice = eurData?.data?.banks?.avg_buy_rate;
  const eurChange = 0;

  const stats = [
    {
      icon: '🥇',
      label: t.gold.karat24,
      value: gold24Price ? formatPrice(gold24Price) : '-',
      change: gold24Change,
      isLive: gold24RecordedAt ? isPriceLive(gold24RecordedAt) : false,
    },
    {
      icon: '💵',
      label: t.currency.dollar,
      value: usdPrice ? `${usdPrice.toFixed(2)} ${t.common.egp}` : '-',
      change: usdChange,
      isLive: false,
    },
    {
      icon: '💶',
      label: t.currency.euro,
      value: eurPrice ? `${eurPrice.toFixed(2)} ${t.common.egp}` : '-',
      change: eurChange,
      isLive: false,
    },
  ];

  return (
    <div className={cn(
      "bg-slate-900 dark:bg-slate-950 border-b border-slate-800",
      className
    )}>
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="text-lg">{stat.icon}</span>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[10px] text-slate-400 leading-none mb-0.5">{stat.label}</p>
                    <p className="text-sm font-bold text-white leading-none">{stat.value}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 text-[10px] font-semibold",
                    stat.change === 0
                      ? 'text-slate-500'
                      : stat.change > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                  )}>
                    {stat.change === 0 ? (
                      <Minus className="h-2.5 w-2.5" />
                    ) : stat.change > 0 ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    <span>{formatPercent(Math.abs(stat.change))}</span>
                  </div>
                  {stat.isLive && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Last Update */}
          <div className={cn(
            "hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 flex-shrink-0",
            isRTL ? "border-r border-slate-700 pr-4" : "border-l border-slate-700 pl-4"
          )}>
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(new Date(dataUpdatedAt))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
