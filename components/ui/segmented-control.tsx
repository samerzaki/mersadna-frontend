'use client';

import { cn } from '@/lib/utils';

export interface SegmentedItem {
  value: string;
  label: string;
  mono?: string;
}

interface SegmentedControlProps {
  items: SegmentedItem[];
  value: string;
  onChange: (value: string) => void;
  otherItems?: SegmentedItem[];
  otherLabel?: string;
  className?: string;
}

export function SegmentedControl({ items, value, onChange, otherItems, otherLabel = 'أخرى', className }: SegmentedControlProps) {
  const isOther = otherItems?.some((o) => o.value === value) ?? false;

  return (
    <div className={cn('flex items-center gap-1.5 p-1 bg-panel2 border border-line rounded-xl w-fit', className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] transition-colors',
              active ? 'bg-panel text-gold' : 'text-muted hover:text-text'
            )}
          >
            {item.mono && <span className="num text-[12.5px]">{item.mono}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
      {otherItems && otherItems.length > 0 && (
        <select
          value={isOther ? value : ''}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          className={cn(
            'h-[30px] px-2 rounded-lg text-[12.5px] border-0 cursor-pointer',
            isOther ? 'bg-panel text-gold' : 'bg-transparent text-muted'
          )}
        >
          <option value="">{otherLabel}</option>
          {otherItems.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
