'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendIndicator } from './trend-indicator';
import { formatPrice, formatPriceChange, formatPercent } from '@/lib/format';
import { GoldPrice } from '@/types';
import { Gem } from 'lucide-react';
import { KARAT_COLORS } from '@/lib/constants';

interface PriceCardProps {
  price: GoldPrice;
  showSparkline?: boolean;
}

export function PriceCard({ price, showSparkline = false }: PriceCardProps) {
  const isPositive = price.change >= 0;

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg">
      {/* Gradient background accent */}
      <div 
        className="absolute left-0 top-0 h-full w-1"
        style={{ 
          background: `linear-gradient(to bottom, ${KARAT_COLORS[price.karat]}, transparent)` 
        }}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Gem className="h-5 w-5" style={{ color: KARAT_COLORS[price.karat] }} />
          {price.name}
        </CardTitle>
        <Badge 
          variant={isPositive ? 'default' : 'destructive'}
          className="gap-1"
        >
          <TrendIndicator change={price.change} showIcon={false} />
          {formatPercent(price.changePercent)}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Buy and Sell Prices in Same Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Buy Price */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">سعر الشراء</p>
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">
                  {formatPrice(price.buyPrice)}
                </p>
                <span
                  className={`text-xs font-medium ${
                    isPositive ? 'text-green-600 dark:text-success' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatPriceChange(price.change)}
                </span>
              </div>
            </div>

            {/* Sell Price */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">سعر البيع</p>
              <p className="text-2xl font-bold text-muted-foreground">
                {formatPrice(price.sellPrice)}
              </p>
            </div>
          </div>

          {/* Mini sparkline placeholder */}
          {showSparkline && (
            <div className="h-12 rounded-md bg-muted/30 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">رسم بياني صغير</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
