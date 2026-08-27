import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureItemProps {
  text: string;
  included?: boolean;
}

export function FeatureItem({ text, included = true }: FeatureItemProps) {
  return (
    <li className={cn(
      'flex items-center gap-2 py-1',
      !included && 'opacity-40'
    )}>
      <Check className={cn(
        'h-4 w-4 shrink-0',
        included ? 'text-primary' : 'text-slate-300 dark:text-slate-700'
      )} />
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {text}
      </span>
    </li>
  );
}
