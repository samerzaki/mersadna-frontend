'use client';

import { GoldHistoryKaratData, UsdRatesHistory } from '@/types';
import { formatPrice, formatDate } from '@/lib/format';
import { SectionCard } from '@/components/ui/section-card';
import { StatTile } from '@/components/ui/stat-tile';
import { ChangeText } from '@/components/ui/change-badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GoldHistoryChartProps {
  title: string;
  data: GoldHistoryKaratData;
  color: string;
  usdRates?: UsdRatesHistory;
}

export function GoldHistoryChart({ title, data, color, usdRates }: GoldHistoryChartProps) {
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
    <SectionCard
      title={title}
      action={<ChangeText value={data.spread_percent} />}
      padded
    >
      {/* Current Prices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatTile label="سعر البيع" value={formatPrice(data.sell_price)} />
        <StatTile label="سعر الشراء" value={formatPrice(data.buy_price)} />
        <StatTile label="الفارق" value={formatPrice(data.spread_egp)} />
      </div>

      {/* USD Rates Statistics (if available) */}
      {usdRates && (
        <div className="pt-4 border-t border-line mb-4">
          <p className="text-sm font-semibold text-text mb-3">
            إحصائيات سعر صرف الدولار ({usdRates.from_currency}/{usdRates.to_currency})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile label="متوسط البيع" value={usdRates.average_sell_rate.toFixed(2)} />
            <StatTile label="متوسط الشراء" value={usdRates.average_buy_rate.toFixed(2)} />
            <StatTile label="أعلى بيع" value={usdRates.highest_sell_rate.toFixed(2)} />
            <StatTile label="أدنى شراء" value={usdRates.lowest_buy_rate.toFixed(2)} />
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line2)" />
            <XAxis
              dataKey="date"
              stroke="var(--muted)"
              style={{ fontSize: '12px', direction: 'ltr' }}
              tickFormatter={(value) => {
                // Format date to show only day/month
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              yAxisId="gold"
              stroke="var(--muted)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toLocaleString('en-US')}`}
            />
            {usdRates && (
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
                border: '1px solid var(--line)',
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
                  stroke="var(--up)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  yAxisId="usd"
                  type="monotone"
                  dataKey="usdBuyRate"
                  name="سعر شراء الدولار"
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
    </SectionCard>
  );
}
