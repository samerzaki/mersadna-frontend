import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, action, padded = false, className, children }: SectionCardProps) {
  return (
    <div className={cn('card-surface overflow-hidden', className)}>
      {title && (
        <div className="card-header-row">
          <span className="font-heading text-[15px] md:text-[16px] font-semibold text-text">{title}</span>
          {action}
        </div>
      )}
      <div className={padded ? 'p-5 md:p-6' : ''}>{children}</div>
    </div>
  );
}
