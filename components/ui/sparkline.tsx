'use client';

import { cn } from '@/lib/utils';

type Tone = 'auto' | 'up' | 'down' | 'gold';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  tone?: Tone;
  className?: string;
}

const TONE_VAR: Record<Exclude<Tone, 'auto'>, string> = {
  up: 'var(--up)',
  down: 'var(--down)',
  gold: 'var(--gold)',
};

export function Sparkline({ data, width = 60, height = 20, strokeWidth = 1.6, tone = 'auto', className }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const top = 2;
  const bottom = height - 2;

  const points = data
    .map((v, i) => {
      const x = 1 + (i * (width - 2)) / (data.length - 1);
      const y = bottom - ((v - min) / span) * (bottom - top);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const resolvedTone: Exclude<Tone, 'auto'> = tone === 'auto' ? (data[data.length - 1] >= data[0] ? 'up' : 'down') : tone;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width={width}
      height={height}
      className={cn('block shrink-0', className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={TONE_VAR[resolvedTone]}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
