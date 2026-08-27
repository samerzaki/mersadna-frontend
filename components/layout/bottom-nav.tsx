"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Coins, Banknote, Wallet, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { navigation } from "@/lib/navigation";

export function BottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Close drawer when route changes
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const bottomNavItems = [
    {
      titleEn: "Home",
      titleAr: "الرئيسية",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      titleEn: "Gold",
      titleAr: "الذهب",
      href: "/gold",
      icon: Coins,
    },
    {
      titleEn: "Currencies",
      titleAr: "العملات",
      href: "/currencies",
      icon: Banknote,
    },
    {
      titleEn: "Portfolio",
      titleAr: "محفظتي",
      href: "/me/portfolio",
      icon: Wallet,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors flex-1 max-w-[80px]",
                  active
                    ? "text-primary"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-all",
                    active && "scale-110"
                  )}
                />
                <span className="text-[10px] font-medium leading-tight">
                  {isRTL ? item.titleAr : item.titleEn}
                </span>
              </Link>
            );
          })}

          {/* Menu Button - Tab 5: More */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors flex-1 max-w-[80px]",
              "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            )}
            aria-label={isRTL ? "فتح القائمة" : "Open menu"}
          >
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-medium leading-tight">
              {isRTL ? "المزيد" : "More"}
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer/Sheet for Menu - Mobile Only */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />

          {/* Panel */}
          <div
            className={cn(
              "absolute top-0 h-full w-72 max-w-[80%] bg-white dark:bg-slate-900 shadow-xl",
              "flex flex-col",
              "transition-transform duration-300 ease-in-out",
              isRTL ? "right-0" : "left-0"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 dark:text-slate-500 uppercase">
                  {isRTL ? "القائمة" : "MENU"}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isRTL ? "جميع الصفحات" : "All Pages"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 h-10 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {navigation.reduce<React.JSX.Element[]>((acc, group, index, arr) => {
                const prev = index > 0 ? arr[index - 1] : null;
                const showSectionHeader =
                  !prev || prev.sectionLabel !== group.sectionLabel;

                acc.push(
                  <div key={group.id} className="space-y-2">
                    {showSectionHeader && (
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 dark:text-slate-500 uppercase mb-1 px-1">
                        {group.sectionLabel}
                      </p>
                    )}

                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between mb-2 px-1">
                      {isRTL ? (
                        <>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">
                            {group.groupTitleAr}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">
                            {group.groupTitleEn}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{group.groupTitleEn}</span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">
                            {group.groupTitleAr}
                          </span>
                        </>
                      )}
                    </div>

                    <nav className="space-y-1">
                      {group.items.map((item) => {
                        const active =
                          pathname === item.href ||
                          (pathname.startsWith(item.href + "/") &&
                            item.href !== "/");
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3",
                              "min-h-[44px] text-sm",
                              "transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 flex-none",
                                active
                                  ? "text-primary"
                                  : "text-slate-400 dark:text-slate-500"
                              )}
                            />
                            <div className="flex flex-col flex-1 items-start">
                              <span className="font-medium">
                                {isRTL ? item.titleAr : item.titleEn}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                {isRTL ? item.titleEn : item.titleAr}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                );

                return acc;
              }, [])}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
