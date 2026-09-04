import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

interface ChangeProps {
  value: number | null | undefined;
  withArrow?: boolean;
  /** Lets API-provided semantic colors override the numerical sign. */
  tone?: 'up' | 'down';
  className?: string;
  direction?: 'rtl' | 'ltr';
}

export function ChangeText({ value, withArrow = true, tone, className, direction }: ChangeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className={cn('num text-dim', className)} dir={direction} style={{ direction }}>—</span>;
  }
  const up = tone ? tone === 'up' : value >= 0;
  return (
    <span className={cn('num', up ? 'text-up' : 'text-down', className)} dir={direction} style={{ direction }}>
      {withArrow && (up ? '↑ ' : '↓ ')}
      {formatPercent(value)}
    </span>
  );
}

export function ChangeChip({ value, tone, className }: ChangeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  const up = tone ? tone === 'up' : value >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full num text-[13px]',
        up ? 'bg-up-soft text-up' : 'bg-down-soft text-down',
        className
      )}
    >
      {up ? '▴' : '▾'} {formatPercent(value)}
    </span>
  );
}
