// Mock data for development

import { GoldPrice, PriceHistory, ChartDataPoint, KaratCode } from '@/types';

/**
 * Mock current prices
 */
export const mockCurrentPrices: Record<KaratCode, GoldPrice> = {
  k24: {
    karat: 'k24',
    name: 'عيار 24',
    buyPrice: 3600,
    sellPrice: 3550,
    change: 30,
    changePercent: 0.84,
    updatedAt: new Date().toISOString(),
  },
  k21: {
    karat: 'k21',
    name: 'عيار 21',
    buyPrice: 3150,
    sellPrice: 3100,
    change: 25,
    changePercent: 0.80,
    updatedAt: new Date().toISOString(),
  },
  k18: {
    karat: 'k18',
    name: 'عيار 18',
    buyPrice: 2700,
    sellPrice: 2650,
    change: 20,
    changePercent: 0.75,
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Generate mock price history data
 */
export function generateMockHistory(
  days: number,
  karat: KaratCode
): PriceHistory[] {
  const history: PriceHistory[] = [];
  const basePrice = mockCurrentPrices[karat].buyPrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic price variation (±2%)
    const variation = (Math.random() - 0.5) * (basePrice * 0.04);
    const price = basePrice + variation;
    const prevPrice = i < days ? history[history.length - 1].buyPrice : price;
    const change = price - prevPrice;
    const changePercent = (change / prevPrice) * 100;

    history.push({
      id: days - i + 1,
      karat,
      buyPrice: Math.round(price * 100) / 100,
      sellPrice: Math.round((price - 50) * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      recordedAt: date.toISOString(),
    });
  }

  return history;
}

/**
 * Generate chart data for all karats
 */
export function generateMockChartData(days: number): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = [];
  const now = new Date();

  const k24History = generateMockHistory(days, 'k24');
  const k21History = generateMockHistory(days, 'k21');
  const k18History = generateMockHistory(days, 'k18');

  for (let i = 0; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - i));

    chartData.push({
      timestamp: date.toISOString(),
      date: date.toLocaleDateString('ar-EG-u-nu-latn', {
        month: 'short', 
        day: 'numeric' 
      }),
      k24: k24History[i]?.buyPrice,
      k21: k21History[i]?.buyPrice,
      k18: k18History[i]?.buyPrice,
    });
  }

  return chartData;
}

/**
 * Generate recent price changes (for history table)
 */
export function generateRecentChanges(limit: number = 50): PriceHistory[] {
  const changes: PriceHistory[] = [];
  const karats: KaratCode[] = ['k24', 'k21', 'k18'];
  
  for (let i = 0; i < limit; i++) {
    const karat = karats[i % 3];
    const date = new Date();
    date.setHours(date.getHours() - i);

    const basePrice = mockCurrentPrices[karat].buyPrice;
    const variation = (Math.random() - 0.5) * (basePrice * 0.02);
    const price = basePrice + variation;
    const change = (Math.random() - 0.5) * 50;
    const changePercent = (change / price) * 100;

    changes.push({
      id: i + 1,
      karat,
      buyPrice: Math.round(price * 100) / 100,
      sellPrice: Math.round((price - 50) * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      recordedAt: date.toISOString(),
    });
  }

  return changes.sort((a, b) => 
    new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );
}
