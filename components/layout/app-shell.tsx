"use client";

import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { useSidebar } from "@/contexts/sidebar-context";

type AppShellProps = {
  children: React.ReactNode;
  statsBanner?: React.ReactNode;
  className?: string;
};

export function AppShell({ children, statsBanner, className }: AppShellProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { isCollapsed } = useSidebar();

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-clip">
        {/* Desktop sidebar - hidden on mobile, fixed on desktop */}
        <Sidebar />

        {/* Main content area */}
        <main
          className={cn(
            "min-h-screen flex flex-col transition-all duration-300",
            // Add margin on desktop to account for fixed sidebar (RTL-aware)
            isRTL
              ? (isCollapsed ? "md:mr-20" : "md:mr-64")
              : (isCollapsed ? "md:ml-20" : "md:ml-64"),
            // Add margin-bottom on mobile to prevent content from being hidden behind bottom nav
            "mb-20 md:mb-0",
            className
          )}
        >
          {/* Stats Banner - appears on all pages */}
          {statsBanner}

          {/* Page content - minimum height ensures footer stays below fold */}
          <div className="flex-1 px-4 py-4 md:px-8 md:py-6 min-h-[60vh]">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </>
  );
}
