"use client";

import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function CurrencyAnalyticsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
          <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {t.pages.analytics.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.pages.analytics.subtitle}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          {t.pages.analytics.comingSoon}
        </p>
      </div>
    </div>
  );
}
