import { SilverOverviewItem } from '@/types';

export interface SilverDataItem {
  id: string;
  nameKey: string;
  sellPrice: number;
  buyPrice: number;
  change: number | null;
  changePercent: number | null;
  changeColor: 'red' | 'green' | 'gray' | null;
  trend: 'up' | 'down' | 'neutral';
  currency: string;
  chartPoints: number[];
  live: boolean;
  lastCheckedAtForHuman: string | null;
}

// Show every silver price returned by the overview, including the global ounce.
export const HOMEPAGE_SILVER_KEYS = ['999_egyptian', '925', '999_swiss', '800', 'ounce'] as const;

export function transformSilverItem(
  key: string,
  data: SilverOverviewItem
): SilverDataItem {
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (data.change.color === 'green') trend = 'up';
  else if (data.change.color === 'red') trend = 'down';

  return {
    id: key,
    nameKey: key,
    sellPrice: data.price.sell,
    buyPrice: data.price.buy,
    change: data.change.value,
    changePercent: data.change.percent,
    changeColor: data.change.color,
    trend,
    currency: data.currency,
    chartPoints: Array.isArray(data.chart_points) ? data.chart_points : [],
    live: data.last_checked.live,
    lastCheckedAtForHuman: data.last_checked.last_checked_at_for_human,
  };
}

export function getSilverName(key: string, isRTL: boolean): string {
  const names: Record<string, { ar: string; en: string }> = {
    ounce: { ar: 'أونصة الفضة العالمية', en: 'Global Silver Ounce' },
    '999_egyptian': { ar: 'فضة 999 مصري', en: 'Silver 999 Egyptian' },
    '925': { ar: 'فضة 925', en: 'Silver 925' },
    '800': { ar: 'فضة 800', en: 'Silver 800' },
    '999_swiss': { ar: 'فضة 999 سويسري', en: 'Silver 999 Swiss' },
  };
  return names[key]?.[isRTL ? 'ar' : 'en'] ?? key;
}
