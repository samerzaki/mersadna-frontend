'use client';

import { SectionCard } from '@/components/ui/section-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useState } from 'react';

type TimeRange = '7d' | '30d' | '90d' | '1y';

export function ComparisonChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 أيام' },
    { value: '30d', label: '30 يوم' },
    { value: '90d', label: '90 يوم' },
    { value: '1y', label: 'سنة' },
  ];

  return (
    <SectionCard
      title="مقارنة أسعار الذهب والدولار"
      action={
        <SegmentedControl
          items={timeRanges}
          value={timeRange}
          onChange={(v) => setTimeRange(v as TimeRange)}
        />
      }
      padded
    >
      <div className="h-64 flex items-center justify-center bg-panel2 rounded-lg border-2 border-dashed border-line">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted">
            الرسم البياني قيد التطوير
          </p>
          <p className="text-xs text-dim">
            سيتم عرض مقارنة تفصيلية بين أسعار الذهب والعملات
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gold rounded" />
              <span className="text-muted">عيار 24</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-up rounded" />
              <span className="text-muted">الدولار</span>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
