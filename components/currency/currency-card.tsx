'use client';

import { CurrencyPrice } from '@/types';
import { formatPercent } from '@/lib/format';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

interface CurrencyCardProps {
  currency: CurrencyPrice;
}

export function CurrencyCard({ currency }: CurrencyCardProps) {
  const { t } = useLanguage();
  const isPositive = currency.change >= 0;
  const isNeutral = currency.change === 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Flag and Name */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">{currency.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {currency.name}
              </p>
              <p className="font-mono font-semibold">{currency.code}</p>
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-2xl font-bold">
              {currency.price.toFixed(2)}
              <span className="text-sm text-muted-foreground mr-1">{t.common.egp}</span>
            </p>
          </div>

          {/* Change */}
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            isNeutral
              ? 'text-muted-foreground'
              : isPositive
              ? 'text-green-600 dark:text-success'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {isNeutral ? (
              <Minus className="h-3.5 w-3.5" />
            ) : isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {formatPercent(Math.abs(currency.changePercent))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
