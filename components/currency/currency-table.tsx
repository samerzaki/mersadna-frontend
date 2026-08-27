'use client';

import { CurrencyPrice } from '@/types';
import { formatPercent } from '@/lib/format';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface CurrencyTableProps {
  currencies: CurrencyPrice[];
}

type SortField = 'name' | 'price' | 'change';
type SortOrder = 'asc' | 'desc';

export function CurrencyTable({ currencies }: CurrencyTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const { t } = useLanguage();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedCurrencies = [...currencies].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'change':
        comparison = a.changePercent - b.changePercent;
        break;
      case 'name':
      default:
        comparison = a.name.localeCompare(b.name, 'ar');
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">{t.currency.currencyName}</TableHead>
            <TableHead className="text-right">{t.currency.code}</TableHead>
            <TableHead 
              className="text-right cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('price')}
            >
              {t.currency.price} ({t.common.egp})
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('change')}
            >
              {t.currency.change}
            </TableHead>
            <TableHead className="text-right">{t.currency.trend}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCurrencies.map((currency) => {
            const isPositive = currency.change >= 0;
            const isNeutral = currency.change === 0;
            
            return (
              <TableRow key={currency.code} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currency.flag}</span>
                    <span>{currency.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono font-semibold">{currency.code}</span>
                </TableCell>
                <TableCell className="font-bold">
                  {currency.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 font-semibold ${
                    isNeutral
                      ? 'text-muted-foreground'
                      : isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isNeutral ? (
                      <Minus className="h-4 w-4" />
                    ) : isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatPercent(Math.abs(currency.changePercent))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-8 flex items-center">
                    <div className={`h-1 rounded-full ${
                      isNeutral
                        ? 'bg-muted w-16'
                        : isPositive
                        ? 'bg-green-500 w-20'
                        : 'bg-red-500 w-20'
                    }`} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
