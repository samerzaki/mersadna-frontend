import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';

interface ArticleLayoutProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  lastUpdated?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ArticleLayout({
  eyebrow,
  title,
  lead,
  lastUpdated,
  actions,
  children,
  className,
}: ArticleLayoutProps) {
  return (
    <div className="max-w-[760px] mx-auto">
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} actions={actions} />
      {lastUpdated && <p className="-mt-4 mb-6 text-[13px] text-dim">{lastUpdated}</p>}
      <article className={cn('card-surface p-6 md:p-8 space-y-6 pb-10 mb-10', className)}>
        {children}
      </article>
    </div>
  );
}
