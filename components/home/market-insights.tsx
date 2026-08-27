'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoldPrices } from '@/hooks/use-gold-prices';
import { useCurrencyPrices } from '@/hooks/use-currency-prices';
import { formatPrice, formatPercent } from '@/lib/format';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function MarketInsights() {
  const { data: goldPrices } = useGoldPrices();
  const { data: currencyPrices } = useCurrencyPrices();
  const { t } = useLanguage();

  // Calculate gold insights
  const gold24 = goldPrices?.find(p => p.karat === 'k24');
  const highestGold = gold24;
  const lowestGold = gold24;
  
  const avgChange = goldPrices
    ? goldPrices.reduce((sum, p) => sum + p.changePercent, 0) / goldPrices.length
    : 0;

  // Calculate currency insights
  const sortedCurrencies = currencyPrices
    ? [...currencyPrices].sort((a, b) => b.changePercent - a.changePercent)
    : [];
  
  const highestCurrency = sortedCurrencies[0];
  const lowestCurrency = sortedCurrencies[sortedCurrencies.length - 1];

  const overallTrend = avgChange > 0 ? t.insights.rising : avgChange < 0 ? t.insights.falling : t.insights.stable;
  const trendIcon = avgChange > 0 ? '🔺' : avgChange < 0 ? '🔻' : '➡️';

  const insights = [
    {
      title: t.insights.highestGoldPrice,
      value: highestGold ? formatPrice(highestGold.buyPrice) : '-',
      subtitle: t.insights.karat24Label,
      color: 'text-gold-600 dark:text-gold-400',
    },
    {
      title: t.insights.lowestGoldPrice,
      value: lowestGold ? formatPrice(lowestGold.sellPrice) : '-',
      subtitle: t.insights.karat24Label,
      color: 'text-gold-600 dark:text-gold-400',
    },
    {
      title: t.insights.averageChange,
      value: formatPercent(avgChange),
      subtitle: t.insights.allKarats,
      color: avgChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      icon: avgChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
    },
    {
      title: t.insights.highestCurrency,
      value: highestCurrency ? `${highestCurrency.code} ${formatPercent(highestCurrency.changePercent)}` : '-',
      subtitle: highestCurrency?.name || '',
      color: 'text-primary-600 dark:text-primary-400',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: t.insights.lowestCurrency,
      value: lowestCurrency ? `${lowestCurrency.code} ${formatPercent(lowestCurrency.changePercent)}` : '-',
      subtitle: lowestCurrency?.name || '',
      color: 'text-red-600 dark:text-red-400',
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      title: t.insights.overallTrend,
      value: `${trendIcon} ${overallTrend}`,
      subtitle: t.insights.markets,
      color: avgChange >= 0 ? 'text-green-600 dark:text-green-400' : avgChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t.insights.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground mb-1">{insight.title}</p>
              <div className="flex items-center gap-1">
                {insight.icon}
                <p className={`text-lg font-bold ${insight.color}`}>
                  {insight.value}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{insight.subtitle}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
