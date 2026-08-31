'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Settings, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { QuickSearch } from './quick-search';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const isRTL = language === 'ar';
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center">
        {/* Logo section - above sidebar on desktop */}
        <div className={cn(
          "relative flex h-full flex-1 items-center justify-between px-4 transition-all duration-300 md:flex-none",
          isCollapsed ? "md:w-20" : "md:w-64",
          "md:shrink-0",
          isRTL ? "md:border-l" : "md:border-r",
          "md:border-slate-200 dark:md:border-slate-800"
        )}>
          <Link href="/" className="relative flex h-full w-full min-w-0 items-center px-2.5 py-3">
            {/* CDN-hosted brand asset; use its original file directly. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isCollapsed
                ? "https://mersadna-cdn.b-cdn.net/assets/images/logos/square.png"
                : "https://mersadna-cdn.b-cdn.net/assets/images/logos/logo.png"}
              alt="Mersadna"
              className="block h-full w-full object-contain"
            />
          </Link>

          {/* Collapse Button - Desktop only */}
          <button
            onClick={toggleCollapse}
            className={cn(
              "absolute top-1/2 z-10 hidden -translate-y-1/2 md:flex items-center justify-center",
              isRTL ? "left-4" : "right-4",
              "w-8 h-8 rounded-lg",
              "text-slate-600 dark:text-slate-300",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
              "transition-colors"
            )}
            title={isCollapsed ? (isRTL ? "توسيع" : "Expand") : (isRTL ? "طي" : "Collapse")}
          >
            {isCollapsed ? (
              isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
            ) : (
              isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Icons section - aligned with main content */}
        <div className="flex-1 flex items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex-1 flex items-center justify-between gap-4 mx-auto max-w-7xl">
            {/* Search - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex md:flex-1 md:max-w-md">
              <QuickSearch />
            </div>

            {/* Icons - right aligned on mobile, aligned with content on desktop */}
            <div className="flex-1 md:flex-none md:flex md:items-center md:justify-end">
              <div className="flex items-center gap-2">
              {/* Mobile: Search Button */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Mobile: Utility Menu Button */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <div className="px-2 py-1.5">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-sm">Language</span>
                      <LanguageSwitcher />
                    </div>
                  </div>

                  <div className="px-2 py-1.5">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>

                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop: Language and Theme toggles */}
              <div className="hidden md:flex md:items-center md:gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* User Avatar / Auth Buttons - Always last */}
              {isAuthenticated ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      type="button"
                    >
                      <Avatar
                        src={user?.avatar}
                        alt={user?.name}
                        fallback={user?.name?.charAt(0).toUpperCase() || 'U'}
                        size="default"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium capitalize">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/me/settings" className="cursor-pointer">
                        الإعدادات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      className="cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Mobile: Single Login button */}
                  <Button size="sm" asChild className="md:hidden">
                    <Link href="/auth/login">تسجيل الدخول</Link>
                  </Button>
                  {/* Desktop: Both Login and Register buttons */}
                  <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
                    <Link href="/auth/login">تسجيل الدخول</Link>
                  </Button>
                  <Button size="sm" asChild className="hidden md:inline-flex">
                    <Link href="/auth/register">إنشاء حساب</Link>
                  </Button>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search - Collapsible */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-border/40 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl">
            <QuickSearch />
          </div>
        </div>
      )}
    </header>
  );
}
