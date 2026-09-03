import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

interface ChangeProps {
  value: number | null | undefined;
  withArrow?: boolean;
  className?: string;
}

export function ChangeText({ value, withArrow = true, className }: ChangeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className={cn('num text-dim', className)}>—</span>;
  }
  const up = value >= 0;
  return (
    <span className={cn('num', up ? 'text-up' : 'text-down', className)}>
      {withArrow && (up ? '↑ ' : '↓ ')}
      {formatPercent(Math.abs(value))}
    </span>
  );
}

export function ChangeChip({ value, className }: ChangeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  const up = value >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full num text-[13px]',
        up ? 'bg-up-soft text-up' : 'bg-down-soft text-down',
        className
      )}
    >
      {up ? '▴' : '▾'} {formatPercent(Math.abs(value))}
    </span>
  );
}
