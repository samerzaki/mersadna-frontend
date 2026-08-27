'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePriceHistory } from '@/hooks/use-price-history';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export function RecentActivity() {
  const { data: history } = usePriceHistory(undefined, undefined, undefined, 6);
  const { t } = useLanguage();

  const getKaratName = (karat: string) => {
    const names: Record<string, string> = {
      k24: t.gold.karat24,
      k21: t.gold.karat21,
      k18: t.gold.karat18,
    };
    return names[karat] || karat;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl">{t.activity.title}</CardTitle>
        <Link href="/history">
          <Button variant="ghost" size="sm" className="gap-1">
            {t.activity.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history && history.length > 0 ? (
            history.map((item, index) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      isPositive 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {getKaratName(item.karat)}: {t.activity.changedTo} {formatPrice(item.buyPrice)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(new Date(item.recordedAt))}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositive ? '+' : ''}{item.change.toFixed(2)} {t.common.egp}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t.activity.noRecentUpdates}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
