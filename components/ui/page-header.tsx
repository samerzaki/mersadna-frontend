import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, lead, actions, className }: PageHeaderProps) {
  return (
    <section className={cn('py-10 md:py-14 pb-6 md:pb-8', className)}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          {eyebrow && <div className="text-[12.5px] text-dim mb-3">{eyebrow}</div>}
          <h1 className="font-heading text-[28px] md:text-[38px] font-semibold tracking-tight text-text m-0">
            {title}
          </h1>
          {lead && <p className="mt-3.5 max-w-[620px] text-[15px] leading-[1.8] text-muted">{lead}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </section>
  );
}
