'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CryptoPrice } from '@/types';
import { formatPriceWithCurrency, formatPercent } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (!data || data.length < 2) return null;

  const width = 100;
  const height = 28;
  const pad = 2;
  const iW = width - pad * 2;
  const iH = height - pad * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * iW,
    y: pad + iH - ((v - min) / range) * iH,
  }));

  const line = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join('');
  const area = `${line}L${pts[pts.length - 1].x},${height - pad}L${pad},${height - pad}Z`;
  const color = isPositive ? '#10b981' : '#ef4444';
  const gId = `sg-${isPositive ? 'u' : 'd'}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gId})`} />
      <polyline
        points={pts.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface CryptoMarketTableProps {
  cryptos: CryptoPrice[];
  pagination?: import('@/types').CryptoPagination;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

type SortField = 'rank' | 'name' | 'price_usd' | 'change_24h' | 'volume_24h' | 'market_cap';
type SortDirection = 'asc' | 'desc';

export function CryptoMarketTable({ cryptos, pagination, onPageChange, isLoading }: CryptoMarketTableProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sort cryptos
  const sortedCryptos = [...cryptos].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'name') {
      return multiplier * a.name.localeCompare(b.name);
    }
    
    return multiplier * (a[sortField] - b[sortField]);
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => handleSort('name')}
                >
                  {isRTL ? 'العملة' : 'Coin'}
                </th>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => handleSort('price_usd')}
                >
                  {isRTL ? 'السعر' : 'Price'}
                </th>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => handleSort('change_24h')}
                >
                  24h
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right">
                  7d
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right">
                  {isRTL ? 'آخر 7 أيام' : 'Last 7d'}
                </th>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => handleSort('volume_24h')}
                >
                  {isRTL ? 'الحجم (24س)' : 'Volume (24h)'}
                </th>
                <th
                  className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => handleSort('market_cap')}
                >
                  {isRTL ? 'القيمة السوقية' : 'Market Cap'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {sortedCryptos.map((crypto) => {
                const isPositive = crypto.change_24h >= 0;
                const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                return (
                  <tr
                    key={crypto.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {crypto.image ? (
                          <img src={crypto.image} alt={crypto.symbol} className="h-8 w-8 rounded-full shrink-0" loading="lazy" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(crypto.symbol || crypto.name || '?').slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {crypto.symbol}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isRTL ? (crypto.nameAr || crypto.name) : crypto.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums text-left">
                      {formatPriceWithCurrency(crypto.price_usd, 'USD', 'en-US')}
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-left">
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatPercent(crypto.change_24h)}
                      </span>
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-left">
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          crypto.change_7d >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatPercent(crypto.change_7d)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <MiniSparkline data={crypto.chart_points} isPositive={crypto.change_7d >= 0} />
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 tabular-nums text-left">
                      ${(crypto.volume_24h / 1_000_000_000).toFixed(2)}B
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 tabular-nums text-left">
                      ${(crypto.market_cap / 1_000_000_000).toFixed(2)}B
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedCryptos.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {isRTL ? 'لا توجد نتائج' : 'No results found'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRTL
                ? `صفحة ${pagination.currentPage} من ${pagination.totalPages}`
                : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage || isLoading}
                onClick={() => onPageChange?.(pagination.currentPage - 1)}
              >
                <ChevronRight className="h-4 w-4 me-1" />
                {isRTL ? 'السابق' : 'Previous'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || isLoading}
                onClick={() => onPageChange?.(pagination.currentPage + 1)}
              >
                {isRTL ? 'التالي' : 'Next'}
                <ChevronLeft className="h-4 w-4 ms-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CryptoMarketTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
