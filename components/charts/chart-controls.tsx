'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TIME_RANGES, KARATS } from '@/lib/constants';
import { TimeRange, KaratCode } from '@/types';
import { cn } from '@/lib/utils';

interface ChartControlsProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  activeKarats: KaratCode[];
  onKaratToggle: (karat: KaratCode) => void;
}

export function ChartControls({
  selectedRange,
  onRangeChange,
  activeKarats,
  onKaratToggle,
}: ChartControlsProps) {
  return (
    <div className="space-y-4">
      {/* Time range selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">الفترة الزمنية</label>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRangeChange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Karat toggles */}
      <div>
        <label className="mb-2 block text-sm font-medium">العيارات</label>
        <div className="flex flex-wrap gap-2">
          {KARATS.map((karat) => {
            const isActive = activeKarats.includes(karat.code);
            return (
              <Badge
                key={karat.code}
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  !isActive && 'opacity-50 hover:opacity-100'
                )}
                onClick={() => onKaratToggle(karat.code)}
              >
                {karat.name}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
