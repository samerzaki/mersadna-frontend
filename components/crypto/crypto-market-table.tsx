'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CryptoPrice } from '@/types';
import { formatPriceWithCurrency } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionCard } from '@/components/ui/section-card';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeText } from '@/components/ui/change-badge';

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
    <SectionCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-panel2 border-b border-line">
            <tr>
              <th
                className="px-4 py-3 text-xs font-semibold text-muted text-right cursor-pointer hover:text-text"
                onClick={() => handleSort('name')}
              >
                {isRTL ? 'العملة' : 'Coin'}
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold text-muted text-right cursor-pointer hover:text-text"
                onClick={() => handleSort('price_usd')}
              >
                {isRTL ? 'السعر' : 'Price'}
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold text-muted text-right cursor-pointer hover:text-text"
                onClick={() => handleSort('change_24h')}
              >
                24h
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted text-right">
                7d
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted text-right">
                {isRTL ? 'آخر 7 أيام' : 'Last 7d'}
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold text-muted text-right cursor-pointer hover:text-text"
                onClick={() => handleSort('volume_24h')}
              >
                {isRTL ? 'الحجم (24س)' : 'Volume (24h)'}
              </th>
              <th
                className="px-4 py-3 text-xs font-semibold text-muted text-right cursor-pointer hover:text-text"
                onClick={() => handleSort('market_cap')}
              >
                {isRTL ? 'القيمة السوقية' : 'Market Cap'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sortedCryptos.map((crypto) => {
              return (
                <tr
                  key={crypto.id}
                  className="hover:bg-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {crypto.image ? (
                        <img src={crypto.image} alt={crypto.symbol} className="h-8 w-8 rounded-full shrink-0" loading="lazy" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gold-soft flex items-center justify-center text-gold text-xs font-bold shrink-0">
                          {(crypto.symbol || crypto.name || '?').slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {crypto.symbol}
                        </p>
                        <p className="text-xs text-muted">
                          {isRTL ? (crypto.nameAr || crypto.name) : crypto.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td dir="ltr" className="px-4 py-3 num text-sm font-semibold text-text text-left">
                    {formatPriceWithCurrency(crypto.price_usd, 'USD', 'en-US')}
                  </td>
                  <td dir="ltr" className="px-4 py-3 text-left">
                    <ChangeText value={crypto.change_24h} />
                  </td>
                  <td dir="ltr" className="px-4 py-3 text-left">
                    <ChangeText value={crypto.change_7d} />
                  </td>
                  <td className="px-4 py-3">
                    {crypto.chart_points && crypto.chart_points.length > 1 && (
                      <Sparkline data={crypto.chart_points} width={100} height={28} tone={crypto.change_7d >= 0 ? 'up' : 'down'} />
                    )}
                  </td>
                  <td dir="ltr" className="px-4 py-3 num text-sm text-muted text-left">
                    ${(crypto.volume_24h / 1_000_000_000).toFixed(2)}B
                  </td>
                  <td dir="ltr" className="px-4 py-3 num text-sm text-muted text-left">
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
          <p className="text-muted">
            {isRTL ? 'لا توجد نتائج' : 'No results found'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-line">
          <p className="text-sm text-muted">
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
    </SectionCard>
  );
}

export function CryptoMarketTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="card-surface p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
