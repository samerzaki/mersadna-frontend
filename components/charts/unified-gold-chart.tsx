'use client';

import { GoldHistoryResponse } from '@/types';
import { formatPrice, formatPriceWithCurrency, formatDate } from '@/lib/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo, useState } from 'react';

type GoldPeriod = '24h' | '7d' | '30d' | '1y' | 'all';

const PERIOD_OPTIONS: { value: GoldPeriod; label: string }[] = [
  { value: '24h', label: '24 ساعة' },
  { value: '7d', label: '7 أيام' },
  { value: '30d', label: '30 يوم' },
  { value: '1y', label: 'سنة' },
  { value: 'all', label: 'الكل' },
];

interface UnifiedGoldChartProps {
  data: GoldHistoryResponse['data'];
  title?: string;
  period?: GoldPeriod;
  onPeriodChange?: (period: GoldPeriod) => void;
  isLoading?: boolean;
}

export function UnifiedGoldChart({ data, title = 'تاريخ أسعار الذهب - جميع العيارات', period = '30d', onPeriodChange, isLoading = false }: UnifiedGoldChartProps) {
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
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>

          {/* Period Selector */}
          {onPeriodChange && (
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as GoldPeriod)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
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
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.k24}
              onChange={() => toggleLine('k24')}
              className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="text-sm font-medium text-slate-700">عيار 24</span>
            <div className="w-8 h-0.5 bg-[#B8860B]"></div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.k21}
              onChange={() => toggleLine('k21')}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-slate-700">عيار 21</span>
            <div className="w-8 h-0.5 bg-[#E85D04]"></div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.k18}
              onChange={() => toggleLine('k18')}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-slate-700">عيار 18</span>
            <div className="w-8 h-0.5 bg-[#6A4C93]"></div>
          </label>

          {data.usd_rates && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleLines.usd}
                onChange={() => toggleLine('usd')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-slate-700">سعر صرف الدولار</span>
              <div className="flex items-center gap-1">
                <div className="w-6 h-0.5 bg-[#3b82f6]" style={{ borderTop: '1.5px dashed #3b82f6' }}></div>
                <div className="w-6 h-0.5 bg-[#10b981]" style={{ borderTop: '1.5px dashed #10b981' }}></div>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-96">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-600" />
              <span className="text-sm font-medium text-slate-500">جاري تحميل البيانات...</span>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: data.usd_rates ? 60 : 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
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
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toLocaleString('en-US')}`}
            />
            {data.usd_rates && (
              <YAxis
                yAxisId="usd"
                orientation="right"
                stroke="#3b82f6"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                direction: 'rtl',
              }}
              labelFormatter={(label) => formatDate(label, 'PPP')}
              formatter={(value: number | undefined, name: string | undefined) => {
                const labels: Record<string, string> = {
                  k24: 'عيار 24',
                  k21: 'عيار 21',
                  k18: 'عيار 18',
                  usdSellRate: 'سعر بيع الدولار',
                  usdBuyRate: 'سعر شراء الدولار',
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
                  k24: 'عيار 24',
                  k21: 'عيار 21',
                  k18: 'عيار 18',
                  usdSellRate: 'سعر بيع الدولار',
                  usdBuyRate: 'سعر شراء الدولار',
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
                name="عيار 24"
                stroke="#B8860B"
                strokeWidth={2}
                dot={{ fill: '#B8860B', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {visibleLines.k21 && (
              <Line
                yAxisId="gold"
                type="monotone"
                dataKey="k21"
                name="عيار 21"
                stroke="#E85D04"
                strokeWidth={2}
                dot={{ fill: '#E85D04', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            {visibleLines.k18 && (
              <Line
                yAxisId="gold"
                type="monotone"
                dataKey="k18"
                name="عيار 18"
                stroke="#6A4C93"
                strokeWidth={2}
                dot={{ fill: '#6A4C93', strokeWidth: 2, r: 3 }}
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
                  name="سعر بيع الدولار"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  yAxisId="usd"
                  type="monotone"
                  dataKey="usdBuyRate"
                  name="سعر شراء الدولار"
                  stroke="#10b981"
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
