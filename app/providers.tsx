'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { HtmlDirection } from '@/components/layout/html-direction';
import { DirectionProvider } from '@radix-ui/react-direction';

/**
 * Wraps children in Radix DirectionProvider so all Radix UI components
 * (Tabs, Select, DropdownMenu, etc.) respect the current language direction.
 */
function RadixDirectionWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <DirectionProvider dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </DirectionProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RadixDirectionWrapper>
          <AuthProvider>
            <SidebarProvider>
              <HtmlDirection />
              {children}
            </SidebarProvider>
          </AuthProvider>
        </RadixDirectionWrapper>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
