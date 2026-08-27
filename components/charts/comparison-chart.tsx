'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            📊 مقارنة أسعار الذهب والدولار
          </CardTitle>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              📈 الرسم البياني قيد التطوير
            </p>
            <p className="text-xs text-muted-foreground">
              سيتم عرض مقارنة تفصيلية بين أسعار الذهب والعملات
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-gold-500 rounded" />
                <span>عيار 24</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-primary-500 rounded" />
                <span>الدولار</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
