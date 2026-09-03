'use client';

import { SegmentedControl } from '@/components/ui/segmented-control';
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
        <label className="mb-2 block text-sm font-medium text-text">الفترة الزمنية</label>
        <SegmentedControl
          items={TIME_RANGES}
          value={selectedRange}
          onChange={(v) => onRangeChange(v as TimeRange)}
        />
      </div>

      {/* Karat toggles */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text">العيارات</label>
        <div className="flex flex-wrap gap-2">
          {KARATS.map((karat) => {
            const isActive = activeKarats.includes(karat.code);
            return (
              <button
                key={karat.code}
                type="button"
                onClick={() => onKaratToggle(karat.code)}
                className={cn(
                  'chip cursor-pointer transition-all hover:scale-105',
                  isActive
                    ? 'bg-gold text-on-gold border-transparent'
                    : 'opacity-50 hover:opacity-100'
                )}
              >
                {karat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
