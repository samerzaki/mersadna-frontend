'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPriceWithCurrency, formatPercent } from '@/lib/format';
import { CryptoPrice } from '@/types';
import { useLanguage } from '@/contexts/language-context';

interface CryptoPriceCardProps {
  crypto: CryptoPrice;
  isHero?: boolean;
}

function Sparkline({
  data,
  isPositive
}: {
  data: number[];
  isPositive: boolean;
}) {
  if (!data || data.length < 2) return null;

  const width = 120;
  const height = 32;
  const padding = 4;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Normalize data to fit within the inner area
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * innerWidth;
    const y = padding + innerHeight - ((value - min) / range) * innerHeight;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaPath = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  const gradientId = `gradient-${isPositive ? 'up' : 'down'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LiveBadge() {
  const { language } = useLanguage();
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {language === 'ar' ? 'مباشر' : 'Live'}
      </span>
    </div>
  );
}

export function CryptoPriceCard({ crypto, isHero = false }: CryptoPriceCardProps) {
  const isPositive = crypto.change_24h >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={`
        bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm
        transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700
        ${isHero ? 'md:col-span-1 border-slate-300 dark:border-slate-700 shadow-md' : ''}
      `}
    >
      <div className={`space-y-4 ${isHero ? 'p-6' : 'p-5'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {crypto.image ? (
              <img
                src={crypto.image}
                alt={crypto.symbol}
                className="h-10 w-10 rounded-full"
                loading="lazy"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                {crypto.symbol.substring(0, 1)}
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {crypto.symbol}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{crypto.name}</p>
            </div>
          </div>
          <LiveBadge />
        </div>

        {/* Main Price (USD) */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">السعر (USD)</p>
          <p className={`font-bold text-slate-900 dark:text-slate-100 tabular-nums ${isHero ? 'text-4xl' : 'text-3xl'}`}>
            {formatPriceWithCurrency(crypto.price_usd, 'USD', 'en-US')}
          </p>
        </div>

        {/* EGP Price */}
        {crypto.price_egp && (
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">السعر (EGP)</p>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 tabular-nums">
              {formatPrice(crypto.price_egp)} ج.م
            </p>
          </div>
        )}

        {/* Market Cap & Volume */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">القيمة السوقية</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
              {(crypto.market_cap / 1_000_000_000).toFixed(2)} B
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">حجم التداول</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
              {(crypto.volume_24h / 1_000_000_000).toFixed(2)} B
            </span>
          </div>
        </div>

        {/* Trend & Sparkline */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <TrendIcon
              className={`h-4 w-4 ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            />
            <span
              className={`text-sm font-semibold tabular-nums ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatPercent(crypto.change_24h)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">24h</span>
          </div>
          <Sparkline data={crypto.chart_points} isPositive={isPositive} />
        </div>
      </div>
    </div>
  );
}
