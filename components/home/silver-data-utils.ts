import { SilverOverviewItem, SilverOunceItem } from '@/types';

export interface SilverDataItem {
  id: string;
  nameKey: string;
  sellPrice: number;
  buyPrice: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  currency: string;
}

// Keep the homepage concise: show the three locally traded grades in one card.
export const HOMEPAGE_SILVER_KEYS = ['999_egyptian', '925', '999_swiss'] as const;

export function transformSilverItem(
  key: string,
  data: SilverOverviewItem | SilverOunceItem
): SilverDataItem {
  const isOunce = key === 'ounce';

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (!isOunce && 'spread_percent' in data) {
    if (data.spread_percent > 0) trend = 'up';
    else if (data.spread_percent < 0) trend = 'down';
  }

  const spread_egp = isOunce ? 0 : (data as SilverOverviewItem).spread_egp;
  const spread_percent = isOunce ? 0 : (data as SilverOverviewItem).spread_percent;

  return {
    id: key,
    nameKey: key,
    sellPrice: data.sell_price,
    buyPrice: data.buy_price,
    change: spread_egp,
    changePercent: spread_percent,
    trend,
    currency: data.currency,
  };
}

export function getSilverName(key: string, isRTL: boolean): string {
  const names: Record<string, { ar: string; en: string }> = {
    ounce: { ar: 'أونصة الفضة العالمية', en: 'Global Silver Ounce' },
    '999_egyptian': { ar: 'فضة 999 مصري', en: 'Silver 999 Egyptian' },
    '925': { ar: 'فضة 925', en: 'Silver 925' },
    '999_swiss': { ar: 'فضة 999 سويسري', en: 'Silver 999 Swiss' },
  };
  return names[key]?.[isRTL ? 'ar' : 'en'] ?? key;
}
