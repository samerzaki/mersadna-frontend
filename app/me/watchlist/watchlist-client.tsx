"use client";

import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function WatchlistPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
          <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {t.pages.watchlist.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.pages.watchlist.subtitle}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          {t.pages.watchlist.comingSoon}
        </p>
      </div>
    </div>
  );
}
