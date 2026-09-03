'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  appTitle?: string;
  appSubtitle?: string;
  showTabs?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AuthCard({ appTitle, appSubtitle, showTabs = true, className, children }: AuthCardProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const tabs = [
    { href: '/auth/login', label: t.pages.login.title },
    { href: '/auth/register', label: t.pages.register.title },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center bg-bg pt-20 sm:pt-28 pb-12 px-4">
      <div className="w-full max-w-[400px]">
        {(appTitle || appSubtitle) && (
          <div className="text-center mb-6">
            {appTitle && (
              <h1 className="font-heading text-[22px] font-bold text-text mb-1.5">{appTitle}</h1>
            )}
            {appSubtitle && <p className="text-[13px] text-muted">{appSubtitle}</p>}
          </div>
        )}

        <div className={cn('card-surface rounded-[18px] p-8', className)}>
          {showTabs && (
            <div className="flex items-center gap-1.5 p-1 mb-6 bg-panel2 border border-line rounded-xl">
              {tabs.map((tab) => {
                const active = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      'flex-1 text-center px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors',
                      active ? 'bg-panel text-gold' : 'text-muted hover:text-text'
                    )}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
