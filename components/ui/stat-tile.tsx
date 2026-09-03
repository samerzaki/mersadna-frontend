import { cn } from '@/lib/utils';

interface StatTileProps {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function StatTile({ label, value, sub, className, compact = false }: StatTileProps) {
  return (
    <div className={cn('stat-tile flex-1 flex flex-col', compact && 'items-start', className)}>
      <div className={cn('text-[11.5px] text-dim', compact ? 'mb-2' : 'mb-1.5')}>{label}</div>
      <div className={cn('num text-[27px] font-medium leading-none text-text', compact && 'w-fit self-start')}>{value}</div>
      {sub && <div className="mt-2">{sub}</div>}
    </div>
  );
}
