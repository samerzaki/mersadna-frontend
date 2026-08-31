'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Coins, CircleDollarSign, Globe } from 'lucide-react';
import { formatPrice, formatPercent } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { translations, type Language } from '@/lib/translations';
import type { HeroStatsBannerData } from './hero-stats-banner-server';

interface HeroStatsBannerClientProps {
  data: HeroStatsBannerData;
}

export function HeroStatsBannerClient({ data }: HeroStatsBannerClientProps) {
  const { language } = useLanguage();
  // This async server-rendered boundary can hydrate after the provider has read
  // a saved client language. Start from the server's Arabic default, then apply
  // the current language after this boundary has hydrated.
  const [displayLanguage, setDisplayLanguage] = useState<Language>('ar');

  useEffect(() => {
    setDisplayLanguage(language);
  }, [language]);

  const t = translations[displayLanguage];

  const { gold24, gold21, gold18, ounce, usdBuy, usdSell } = data;

  const goldStats = [
    {
      icon: Coins,
      label: t.gold.karat24,
      value: gold24 ? formatPrice(gold24.sell_price) : '-',
      change: gold24?.spread_percent || 0,
      isLive: gold24?.is_live ?? false,
    },
    {
      icon: Coins,
      label: t.gold.karat21,
      value: gold21 ? formatPrice(gold21.sell_price) : '-',
      change: gold21?.spread_percent || 0,
      isLive: gold21?.is_live ?? false,
    },
    {
      icon: Coins,
      label: t.gold.karat18,
      value: gold18 ? formatPrice(gold18.sell_price) : '-',
      change: gold18?.spread_percent || 0,
      isLive: gold18?.is_live ?? false,
    },
    {
      icon: Globe,
      label: t.gold.ounce,
      value: ounce ? `$${new Intl.NumberFormat('en-US').format(ounce.sell_price)}` : '-',
      change: 0,
      isLive: ounce?.is_live ?? false,
    },
  ];

  const currencyStats = [
    {
      icon: CircleDollarSign,
      label: 'أعلى شراء',
      value: usdBuy?.price ? `${parseFloat(usdBuy.price).toFixed(2)}` : '-',
      bank: usdBuy?.bank,
    },
    {
      icon: CircleDollarSign,
      label: 'أعلى بيع',
      value: usdSell?.price ? `${parseFloat(usdSell.price).toFixed(2)}` : '-',
      bank: usdSell?.bank,
    },
  ];

  return (
    <div className="md:sticky md:top-16 md:z-40 bg-linear-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-200/20 dark:border-amber-800/20 backdrop-blur-sm">
      <div className="px-4 md:px-8 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-6 overflow-x-auto">
          {/* All Stats */}
          <div className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide">
            {/* Gold Stats */}
            {goldStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 shrink-0 group cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Icon className="h-5 w-5 text-amber-600/70 dark:text-amber-400/70" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                      {stat.isLive && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold">{stat.value}</p>
                      <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                        stat.change === 0
                          ? 'text-muted-foreground'
                          : stat.change > 0
                          ? 'text-green-600 dark:text-success'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change === 0 ? (
                          <Minus className="h-2.5 w-2.5" />
                        ) : stat.change > 0 ? (
                          <TrendingUp className="h-2.5 w-2.5" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5" />
                        )}
                        <span>{formatPercent(Math.abs(stat.change))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Separator */}
            <div className="h-8 w-px bg-border shrink-0 self-center" />

            {/* Currency Stats */}
            {currencyStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={`currency-${index}`}
                  className="flex items-center gap-2.5 shrink-0 group cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Icon className="h-5 w-5 text-emerald-600/70 dark:text-emerald-400/70" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{stat.value}</p>
                      {stat.bank?.bank_logo_url && (
                        <Image
                          src={stat.bank.bank_logo_url}
                          alt={stat.bank.name}
                          width={16}
                          height={16}
                          className="h-4 w-4 rounded-sm object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
