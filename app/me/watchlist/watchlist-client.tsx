"use client";

import { useLanguage } from "@/contexts/language-context";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function WatchlistPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <PageHeader title={t.pages.watchlist.title} lead={t.pages.watchlist.subtitle} />

      <SectionCard padded>
        <p className="text-center text-muted py-8">
          {t.pages.watchlist.comingSoon}
        </p>
      </SectionCard>
    </div>
  );
}
