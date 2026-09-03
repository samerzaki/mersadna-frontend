'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SectionCard } from '@/components/ui/section-card';
import { KARAT_COLORS } from '@/lib/constants';
import { KaratCode, PriceHistory } from '@/types';
import { formatPrice } from '@/lib/format';
import { useLanguage } from '@/contexts/language-context';

interface PriceChartProps {
  data: PriceHistory[];
  activeKarats: KaratCode[];
  title?: string;
}

export function PriceChart({ data, activeKarats, title }: PriceChartProps) {
  const { t } = useLanguage();
  const chartTitle = title || t.charts.chartTitle;
  // Transform data for recharts
  const chartData = useMemo(() => {
    const groupedByDate: Record<string, any> = {};

    data.forEach((item) => {
      const date = new Date(item.recordedAt).toLocaleDateString('ar-EG-u-nu-latn', {
        month: 'short',
        day: 'numeric',
      });

      if (!groupedByDate[date]) {
        groupedByDate[date] = { date, timestamp: item.recordedAt };
      }

      groupedByDate[date][item.karat] = item.buyPrice;
    });

    return Object.values(groupedByDate).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-line bg-panel p-3 shadow-card">
          <p className="mb-2 font-semibold text-text">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted">{entry.name}:</span>
              <span className="num font-medium text-text">{formatPrice(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <SectionCard title={chartTitle} padded>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line2)" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'var(--muted)' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'var(--muted)' }}
            tickFormatter={(value) => `${value.toLocaleString('en-US')} ${t.common.egp}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const karatNames: Record<string, string> = {
                k24: t.gold.karat24,
                k21: t.gold.karat21,
                k18: t.gold.karat18,
              };
              return karatNames[value] || value;
            }}
          />
          {activeKarats.includes('k24') && (
            <Line
              type="monotone"
              dataKey="k24"
              stroke={KARAT_COLORS.k24}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {activeKarats.includes('k21') && (
            <Line
              type="monotone"
              dataKey="k21"
              stroke={KARAT_COLORS.k21}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {activeKarats.includes('k18') && (
            <Line
              type="monotone"
              dataKey="k18"
              stroke={KARAT_COLORS.k18}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}
