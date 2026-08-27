"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Crown } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top bar with hamburger - Only visible on mobile */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 h-11 text-slate-700 dark:text-slate-200 shadow-sm active:scale-[0.98] transition hover:bg-slate-50 dark:hover:bg-slate-700"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200 ms-1">
            {isRTL ? "سوق الذهب" : "Gold Market"}
          </span>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
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
                  {isRTL ? "التنقل" : "NAVIGATION"}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isRTL ? "مساحتي في السوق" : "My Market Space"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 h-10 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                aria-label="Close navigation"
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
                        const isActive =
                          pathname === item.href ||
                          (pathname.startsWith(item.href + "/") &&
                            item.href !== "/");
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3",
                              "min-h-[44px] text-sm",
                              "transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                              isActive
                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                          >
                            {/* Group 1 (Start): Icon + Label */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Icon
                                className={cn(
                                  "h-5 w-5 flex-none",
                                  isActive
                                    ? "text-primary-600 dark:text-primary-400"
                                    : "text-slate-400 dark:text-slate-500"
                                )}
                              />
                              <div className="flex flex-col items-start min-w-0">
                                <span className="font-medium">
                                  {isRTL ? item.titleAr : item.titleEn}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {isRTL ? item.titleEn : item.titleAr}
                                </span>
                              </div>
                            </div>

                            {/* Group 2 (End): VIP Badge */}
                            {item.isVip && (
                              <span className="flex items-center gap-1 bg-primary-600 dark:bg-primary-500 !text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0">
                                <Crown size={10} className="fill-white" />
                                <span className="!text-white">{isRTL ? "برو" : "PRO"}</span>
                              </span>
                            )}
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
