import { cn } from '@/lib/utils';
import { formatPriceWithCurrency } from '@/lib/format';

interface MonoNumberProps {
  value: number | string | null | undefined;
  currency?: string;
  locale?: string;
  className?: string;
}

export function MonoNumber({ value, currency = 'EGP', locale = 'ar-EG', className }: MonoNumberProps) {
  return <span className={cn('num', className)}>{formatPriceWithCurrency(value, currency, locale)}</span>;
}
