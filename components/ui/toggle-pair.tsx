'use client';

import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface TogglePairProps {
  options: [Option, Option];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TogglePair({ options, value, onChange, className }: TogglePairProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 h-11 rounded-[10px] border text-[13px] bg-bg transition-colors',
              active ? 'border-gold text-gold' : 'border-line text-muted'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
