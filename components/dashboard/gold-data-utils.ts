import { GoldOverviewItem, GoldOunceItem } from '@/types';

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
  data: GoldOverviewItem | GoldOunceItem,
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
  const isOunce = key === 'ounce';

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (!isOunce && 'spread_percent' in data) {
    if (data.spread_percent > 0) trend = 'up';
    else if (data.spread_percent < 0) trend = 'down';
  }

  const spread_egp = isOunce ? 0 : (data as GoldOverviewItem).spread_egp;
  const spread_percent = isOunce ? 0 : (data as GoldOverviewItem).spread_percent;
  const chartPoints = isOunce ? [] : (data as GoldOverviewItem).chart_points;
  const chartColor = isOunce ? 'gray' : (data as GoldOverviewItem).chart_color;

  return {
    id: mapping.id,
    nameKey: mapping.nameKey,
    karat: mapping.karat,
    sellPrice: data.sell_price,
    buyPrice: data.buy_price,
    change: spread_egp,
    changePercent: spread_percent,
    trend,
    currency: data.currency,
    recordedAt: data.recorded_at,
    chartPoints: Array.isArray(chartPoints) ? chartPoints : [],
    chartColor,
    lastCheckedAt,
    lastCheckedAtForHuman,
  };
}
