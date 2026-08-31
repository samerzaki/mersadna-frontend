'use client';

import { GoldHistoryKaratData, UsdRatesHistory } from '@/types';
import { formatPrice, formatDate } from '@/lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GoldHistoryChartProps {
  title: string;
  data: GoldHistoryKaratData;
  color: string;
  usdRates?: UsdRatesHistory;
}

export function GoldHistoryChart({ title, data, color, usdRates }: GoldHistoryChartProps) {
  const isPositive = data.spread_percent > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // Transform chart points for recharts and merge with USD rates if available
  const chartData = data.chart_points.map((point) => {
    const baseData: any = {
      date: point.date,
      price: point.price,
    };

    // Find matching USD rate for this date
    if (usdRates) {
      const usdPoint = usdRates.chart_points.find(usd => usd.date === point.date);
      if (usdPoint) {
        baseData.usdSellRate = usdPoint.sell_rate;
        baseData.usdBuyRate = usdPoint.buy_rate;
      }
    }

    return baseData;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2">
            <TrendIcon
              className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
            />
            <span
              className={`text-lg font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}
              {data.spread_percent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Current Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">سعر البيع</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(data.sell_price)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">سعر الشراء</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(data.buy_price)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">الفارق</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(data.spread_egp)}
            </p>
          </div>
        </div>

        {/* USD Rates Statistics (if available) */}
        {usdRates && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              إحصائيات سعر صرف الدولار ({usdRates.from_currency}/{usdRates.to_currency})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">متوسط البيع</p>
                <p className="text-lg font-bold text-primary-900">
                  {usdRates.average_sell_rate.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">متوسط الشراء</p>
                <p className="text-lg font-bold text-green-900">
                  {usdRates.average_buy_rate.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">أعلى بيع</p>
                <p className="text-lg font-bold text-red-900">
                  {usdRates.highest_sell_rate.toFixed(2)}
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 mb-1">أدنى شراء</p>
                <p className="text-lg font-bold text-amber-900">
                  {usdRates.lowest_buy_rate.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              style={{ fontSize: '12px', direction: 'ltr' }}
              tickFormatter={(value) => {
                // Format date to show only day/month
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              yAxisId="gold"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toLocaleString('en-US')}`}
            />
            {usdRates && (
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
                  price: 'سعر الذهب',
                  usdSellRate: 'سعر بيع الدولار',
                  usdBuyRate: 'سعر شراء الدولار',
                };
                return [
                  name === 'price' ? formatPrice(value ?? 0) : (value ?? 0).toFixed(2),
                  labels[name ?? ''] || name || ''
                ];
              }}
            />
            {usdRates && <Legend />}
            <Line
              yAxisId="gold"
              type="monotone"
              dataKey="price"
              name="سعر الذهب"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            {usdRates && (
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
