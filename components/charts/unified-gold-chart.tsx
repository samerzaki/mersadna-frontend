'use client';

import { GoldHistoryResponse } from '@/types';
import { formatPrice, formatDate } from '@/lib/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

type GoldPeriod = '24h' | '7d' | '30d' | '1y' | 'all';

interface UnifiedGoldChartProps {
  data: GoldHistoryResponse['data'];
  title?: string;
  period?: GoldPeriod;
  onPeriodChange?: (period: GoldPeriod) => void;
  isLoading?: boolean;
}

export function UnifiedGoldChart({ data, title, period = '30d', onPeriodChange, isLoading = false }: UnifiedGoldChartProps) {
  const { t } = useLanguage();
  const effectiveTitle = title ?? t.charts.defaultGoldChartTitle;

  const PERIOD_OPTIONS: { value: GoldPeriod; label: string }[] = [
    { value: '24h', label: t.charts.period24h },
    { value: '7d', label: t.charts.period7d },
    { value: '30d', label: t.charts.period30d },
    { value: '1y', label: t.charts.period1y },
    { value: 'all', label: t.charts.periodAll },
  ];
  // State for toggling chart lines
  const [visibleLines, setVisibleLines] = useState({
    k24: true,
    k21: true,
    k18: true,
    usd: true,
  });

  const toggleLine = (lineKey: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  // Merge all karat data with USD rates into single chart data array
  const chartData = useMemo(() => {
    if (!data) return [];
    const points24 = data.karat_24?.chart_points ?? [];
    const points21 = data.karat_21?.chart_points ?? [];
    const points18 = data.karat_18?.chart_points ?? [];

    // Get the longest array to ensure we have all dates
    const maxLength = Math.max(
      points24.length,
      points21.length,
      points18.length
    );

    const mergedData = [];

    for (let i = 0; i < maxLength; i++) {
      const point24 = points24[i];
      const point21 = points21[i];
      const point18 = points18[i];

      // Use date from first available point
      const date = point24?.date || point21?.date || point18?.date;

      const dataPoint: any = {
        date,
        k24: point24?.price,
        k21: point21?.price,
        k18: point18?.price,
      };

      // Add USD rates if available
      if (data.usd_rates) {
        const usdPoint = (data.usd_rates.chart_points ?? []).find(usd => usd.date === date);
        if (usdPoint) {
          dataPoint.usdSellRate = usdPoint.sell_rate;
          dataPoint.usdBuyRate = usdPoint.buy_rate;
        }
      }

      mergedData.push(dataPoint);
    }

    return mergedData;
  }, [data]);

  if (!data) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="font-heading text-[18px] md:text-[20px] font-semibold text-text">{effectiveTitle}</h3>

          {/* Period Selector */}
          {onPeriodChange && (
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as GoldPeriod)}
              className="h-10 rounded-[11px] border border-line bg-bg px-3 text-[13px] text-text focus:border-gold focus:outline-none"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Checkbox Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-panel2 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.k24}
              onChange={() => toggleLine('k24')}
              className="w-4 h-4 accent-gold rounded"
            />
            <span className="text-[13px] font-medium text-text">{t.gold.karat24}</span>
            <div className="w-8 h-0.5" style={{ background: 'var(--gold)' }}></div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.k21}
              onChange={() => toggleLine('k21')}
              className="w-4 h-4 accent-gold rounded"
            />
            <span className="text-[13px] font-medium text-text">{t.gold.karat21}</span>
            <div className="w-8 h-0.5" style={{ background: 'var(--up)' }}></div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.k18}
              onChange={() => toggleLine('k18')}
              className="w-4 h-4 accent-gold rounded"
            />
            <span className="text-[13px] font-medium text-text">{t.gold.karat18}</span>
            <div className="w-8 h-0.5" style={{ background: 'var(--muted)' }}></div>
          </label>

          {data.usd_rates && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleLines.usd}
                onChange={() => toggleLine('usd')}
                className="w-4 h-4 accent-gold rounded"
              />
              <span className="text-[13px] font-medium text-text">{t.charts.usdExchangeRate}</span>
              <div className="flex items-center gap-1">
                <div className="w-6 h-0.5" style={{ borderTop: '1.5px dashed var(--up)' }}></div>
                <div className="w-6 h-0.5" style={{ borderTop: '1.5px dashed var(--down)' }}></div>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-96">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-panel/70 backdrop-blur-[1px] rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-gold" />
              <span className="text-sm font-medium text-muted">{t.charts.loadingData}</span>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: data.usd_rates ? 60 : 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line2)" />
            <XAxis
              dataKey="date"
              stroke="var(--muted)"
              style={{ fontSize: '11px', direction: 'ltr' }}
              angle={-45}
              textAnchor="end"
              height={70}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <YAxis
              yAxisId="gold"
              stroke="var(--muted)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toLocaleString('en-US')}`}
            />
            {data.usd_rates && (
              <YAxis
                yAxisId="usd"
                orientation="right"
                stroke="var(--up)"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--panel)',
                border: '1px solid var(--line2)',
                borderRadius: '10px',
                direction: 'rtl',
              }}
              labelFormatter={(label) => formatDate(label, 'PPP')}
              formatter={(value: number | undefined, name: string | undefined) => {
                const labels: Record<string, string> = {
                  k24: t.gold.karat24,
                  k21: t.gold.karat21,
                  k18: t.gold.karat18,
                  usdSellRate: t.charts.usdSellRate,
                  usdBuyRate: t.charts.usdBuyRate,
                };

                const field = name ?? '';
                const isUSD = field === 'usdSellRate' || field === 'usdBuyRate';

                return [
                  isUSD ? (value ?? 0).toFixed(2) : formatPrice(value ?? 0),
                  labels[field] || field
                ];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  k24: t.gold.karat24,
                  k21: t.gold.karat21,
                  k18: t.gold.karat18,
                  usdSellRate: t.charts.usdSellRate,
                  usdBuyRate: t.charts.usdBuyRate,
                };
                return labels[value] || value;
              }}
            />

            {/* Gold Price Lines */}
            {visibleLines.k24 && (
              <Line
                yAxisId="gold"
                type="monotone"
                dataKey="k24"
                name={t.gold.karat24}
                stroke="var(--gold)"
                strokeWidth={2}
                dot={{ fill: 'var(--gold)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {visibleLines.k21 && (
              <Line
                yAxisId="gold"
                type="monotone"
                dataKey="k21"
                name={t.gold.karat21}
                stroke="var(--up)"
                strokeWidth={2}
                dot={{ fill: 'var(--up)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {visibleLines.k18 && (
              <Line
                yAxisId="gold"
                type="monotone"
                dataKey="k18"
                name={t.gold.karat18}
                stroke="var(--muted)"
                strokeWidth={2}
                dot={{ fill: 'var(--muted)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {/* USD Rate Lines (if available) */}
            {data.usd_rates && visibleLines.usd && (
              <>
                <Line
                  yAxisId="usd"
                  type="monotone"
                  dataKey="usdSellRate"
                  name={t.charts.usdSellRate}
                  stroke="var(--up)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  yAxisId="usd"
                  type="monotone"
                  dataKey="usdBuyRate"
                  name={t.charts.usdBuyRate}
                  stroke="var(--down)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
