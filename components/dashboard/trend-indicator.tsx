import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  change: number;
  className?: string;
  showIcon?: boolean;
}

export function TrendIndicator({ 
  change, 
  className,
  showIcon = true 
}: TrendIndicatorProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        isPositive && 'text-green-600 dark:text-green-400',
        change < 0 && 'text-red-600 dark:text-red-400',
        isNeutral && 'text-muted-foreground',
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4" />}
    </div>
  );
}
