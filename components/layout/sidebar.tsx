"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Crown, Settings, User, ChevronDown } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarProps = {
  className?: string;
};

// Helper function to find which group contains the active page
function findActiveGroup(currentPath: string): string | null {
  // Build a set of all exact navigation hrefs for quick lookup
  const allNavHrefs = new Set(
    navigation.flatMap((g) => g.items.map((item) => item.href))
  );

  for (const group of navigation) {
    const hasActiveItem = group.items.some(
      (item) =>
        currentPath === item.href ||
        (currentPath.startsWith(item.href + "/") &&
          item.href !== "/" &&
          !allNavHrefs.has(currentPath))
    );
    if (hasActiveItem) {
      return group.id;
    }
  }
  // Default to first group if no match found
  return navigation.length > 0 ? navigation[0].id : null;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { isCollapsed } = useSidebar();

  // Track which groups are expanded (by group id)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Start with the group that contains the current page
    const activeGroupId = findActiveGroup(pathname);
    return new Set(activeGroupId ? [activeGroupId] : []);
  });

  // Update expanded group when pathname changes
  useEffect(() => {
    const activeGroupId = findActiveGroup(pathname);
    if (activeGroupId) {
      setExpandedGroups(new Set([activeGroupId]));
    }
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    const wasExpanded = expandedGroups.has(groupId);

    if (wasExpanded) {
      setExpandedGroups(new Set());
      return;
    }

    // Open this group and navigate to first item
    setExpandedGroups(new Set([groupId]));
    const group = navigation.find(g => g.id === groupId);
    if (group && group.items.length > 0) {
      router.push(group.items[0].href);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:shrink-0 transition-all duration-300",
          isCollapsed ? "md:w-20" : "md:w-64",
          "md:fixed md:top-16 md:left-0 md:h-[calc(100vh-4rem)]",
          "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800",
          isRTL ? "md:border-l md:right-0 md:left-auto" : "md:border-r",
          className
        )}
      >
        {/* Body: Scrollable Navigation */}
        <div className={cn(
          "flex-1 overflow-y-auto scrollbar-hide py-6 min-h-0",
          isCollapsed ? "px-2" : "px-4"
        )}>
        <div className={cn("space-y-6", isCollapsed && "space-y-2")}>
          {navigation.reduce<React.JSX.Element[]>((acc, group) => {
            // Build a set of all exact navigation hrefs for quick lookup
            const allNavHrefs = new Set(
              navigation.flatMap((g) => g.items.map((item) => item.href))
            );

            const isExpanded = expandedGroups.has(group.id);
            const GroupIcon = group.groupIcon;

            // Check if any item in this group is active
            const hasActiveItem = group.items.some(
              (item) =>
                pathname === item.href ||
                (pathname.startsWith(item.href + "/") &&
                  item.href !== "/" &&
                  !allNavHrefs.has(pathname))
            );

            acc.push(
              <div key={group.id} className="space-y-2">
                {/* Collapsed Mode: Show Group Icon Only */}
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          "w-full flex items-center justify-center",
                          "px-3 py-3 rounded-lg",
                          "text-slate-600 dark:text-slate-300",
                          "hover:bg-slate-50 dark:hover:bg-slate-800",
                          "transition-colors relative",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          (isExpanded || hasActiveItem) && "bg-primary-50 text-primary dark:bg-primary/20 dark:text-primary"
                        )}
                      >
                        <GroupIcon
                          className={cn(
                            "w-5 h-5",
                            (isExpanded || hasActiveItem)
                              ? "text-primary dark:text-primary"
                              : "text-slate-400 dark:text-slate-500"
                          )}
                        />
                        {/* Active indicator */}
                        {isExpanded && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side={isRTL ? "left" : "right"}>
                      <p className="font-medium">
                        {isRTL ? group.groupTitleAr : group.groupTitleEn}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  /* Expanded Mode: Show Group Header */
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2",
                      "px-3 py-2 rounded-lg",
                      "font-semibold text-slate-600 dark:text-slate-300",
                      "hover:bg-slate-50 dark:hover:bg-slate-800",
                      "transition-all cursor-pointer",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isExpanded
                        ? "text-xs uppercase tracking-wider"
                        : "text-sm"
                    )}
                  >
                    <span>{isRTL ? group.groupTitleAr : group.groupTitleEn}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </button>
                )}

                {/* Navigation Items - Show only when group is expanded */}
                {isExpanded && (
                  <nav className={cn(
                    "space-y-1",
                    !isCollapsed && "animate-in fade-in slide-in-from-top-2 duration-200"
                  )}>
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (pathname.startsWith(item.href + "/") &&
                          item.href !== "/" &&
                          !allNavHrefs.has(pathname));

                      const Icon = item.icon;

                      const linkContent = (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center rounded-lg text-slate-600",
                            "transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                            isCollapsed ? "gap-0 px-3 py-3 justify-center relative" : "gap-3 px-3 py-2",
                            isActive
                              ? "bg-primary-50 text-primary font-medium dark:bg-primary/20 dark:text-primary"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300"
                          )}
                        >
                          {/* Icon */}
                          <Icon
                            className={cn(
                              "w-5 h-5 flex-none",
                              isActive
                                ? "text-primary dark:text-primary"
                                : "text-slate-400 dark:text-slate-500"
                            )}
                          />

                          {/* Label - Hidden when collapsed */}
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 min-w-0">
                                {isRTL ? item.titleAr : item.titleEn}
                              </span>

                              {/* PRO Badge - Golden Tag */}
                              {item.isVip && (
                                <span className="ml-auto text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 font-bold shrink-0 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                  <Crown size={8} className="inline-block mr-0.5" />
                                  {isRTL ? "برو" : "PRO"}
                                </span>
                              )}
                            </>
                          )}

                          {/* PRO indicator dot when collapsed */}
                          {isCollapsed && item.isVip && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full border border-white dark:border-slate-900" />
                          )}
                        </Link>
                      );

                      return isCollapsed ? (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>
                            {linkContent}
                          </TooltipTrigger>
                          <TooltipContent side={isRTL ? "left" : "right"}>
                            <p className="font-medium">
                              {isRTL ? item.titleAr : item.titleEn}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkContent
                      );
                    })}
                  </nav>
                )}
              </div>
            );

            return acc;
          }, [])}
        </div>
      </div>

      {/* Footer: User Profile */}
      <div className={cn(
        "shrink-0 border-t border-slate-100 dark:border-slate-800 py-4",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer",
                "gap-0 px-3 py-3 justify-center"
              )}>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side={isRTL ? "left" : "right"}>
              <p className="font-medium">
                {isRTL ? "المستخدم" : "User"}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className={cn(
            "flex items-center rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer",
            "gap-3 px-3 py-2"
          )}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>

            {/* Name & Settings */}
            <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-0 truncate">
              {isRTL ? "المستخدم" : "User"}
            </span>
            <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          </div>
        )}
      </div>
    </aside>
    </TooltipProvider>
  );
}
