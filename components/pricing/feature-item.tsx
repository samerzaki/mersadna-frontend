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
        included ? 'text-gold' : 'text-dim'
      )} />
      <span className="text-xs text-muted">
        {text}
      </span>
    </li>
  );
}
