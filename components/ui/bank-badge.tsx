import { cn } from '@/lib/utils';

function hashHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

interface BankBadgeProps {
  name: string;
  initials?: string;
  logoUrl?: string;
  size?: 34 | 40;
  className?: string;
}

export function BankBadge({ name, initials, logoUrl, size = 34, className }: BankBadgeProps) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        style={{ width: size, height: size }}
        className={cn('rounded-[9px] object-contain bg-panel2', className)}
      />
    );
  }

  const hue = hashHue(name);
  const label = (initials || name).slice(0, 4).toUpperCase();

  return (
    <span
      style={{
        width: size,
        height: size,
        background: `oklch(0.62 0.14 ${hue} / 0.16)`,
        color: `oklch(0.7 0.14 ${hue})`,
      }}
      className={cn('flex items-center justify-center rounded-[9px] num text-[10.5px] font-semibold shrink-0', className)}
    >
      {label}
    </span>
  );
}
