"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Coins, Banknote, Wallet, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { NavSheet } from "./nav-sheet";

export function BottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const isRTL = language === "ar";

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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-panel pb-safe">
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
                  active ? "text-gold" : "text-muted hover:text-text"
                )}
              >
                <Icon className={cn("h-6 w-6 transition-all", active && "scale-110")} />
                <span className="text-[10px] font-medium leading-tight">
                  {isRTL ? item.titleAr : item.titleEn}
                </span>
              </Link>
            );
          })}

          {/* Menu Button - Tab 5: More */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors flex-1 max-w-[80px] text-muted hover:text-text"
            aria-label={isRTL ? "فتح القائمة" : "Open menu"}
          >
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-medium leading-tight">
              {isRTL ? "المزيد" : "More"}
            </span>
          </button>
        </div>
      </nav>

      <NavSheet open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
