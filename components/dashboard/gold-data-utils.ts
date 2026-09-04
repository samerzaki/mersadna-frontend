import { GoldOverviewItem } from '@/types';

/**
 * Shared data structure for gold items
 * This file has NO 'use client' directive so it can be imported by both
 * server and client components.
 */
export interface GoldDataItem {
  id: string;
  nameKey: 'karat21' | 'karat24' | 'karat18' | 'pound' | 'ounce';
  karat: string;
  sellPrice: number;
  buyPrice: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  currency: string;
  recordedAt: string;
  chartPoints: number[];
  chartColor: string;
  lastCheckedAt?: string;
  lastCheckedAtForHuman?: string;
}

/**
 * Transform API response data to GoldDataItem format
 */
export function transformApiDataToGoldDataItem(
  key: string,
  data: GoldOverviewItem,
  lastCheckedAt?: string,
  lastCheckedAtForHuman?: string
): GoldDataItem {
  const keyMap: Record<string, { id: string; nameKey: GoldDataItem['nameKey']; karat: string }> = {
    '21': { id: 'k21', nameKey: 'karat21', karat: 'k21' },
    '24': { id: 'k24', nameKey: 'karat24', karat: 'k24' },
    '18': { id: 'k18', nameKey: 'karat18', karat: 'k18' },
    'gold_pound': { id: 'pound', nameKey: 'pound', karat: 'pound' },
    'ounce': { id: 'ounce', nameKey: 'ounce', karat: 'ounce' },
  };

  const mapping = keyMap[key];
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (data.change.color === 'green') trend = 'up';
  else if (data.change.color === 'red') trend = 'down';

  return {
    id: mapping.id,
    nameKey: mapping.nameKey,
    karat: mapping.karat,
    sellPrice: data.price.sell,
    buyPrice: data.price.buy,
    change: data.change.value,
    changePercent: data.change.percent,
    trend,
    currency: data.currency,
    recordedAt: data.last_checked.last_checked_at,
    chartPoints: Array.isArray(data.chart_points) ? data.chart_points : [],
    chartColor: data.chart_color,
    lastCheckedAt: lastCheckedAt ?? data.last_checked.last_checked_at,
    lastCheckedAtForHuman: lastCheckedAtForHuman ?? data.last_checked.last_checked_at_for_human,
  };
}
