import { cn } from '@/lib/utils';

type Tone = 'up' | 'down' | 'gold';

const TONE_CLASS: Record<Tone, string> = {
  up: 'bg-up',
  down: 'bg-down',
  gold: 'bg-gold',
};

export function LiveDot({ tone = 'gold', size = 6, className }: { tone?: Tone; size?: 6 | 7; className?: string }) {
  return (
    <span
      className={cn('live-dot inline-block', TONE_CLASS[tone], className)}
      style={{ width: size, height: size }}
    />
  );
}
