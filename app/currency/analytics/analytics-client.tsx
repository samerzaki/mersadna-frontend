"use client";

import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function CurrencyAnalyticsPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHeader
        eyebrow={t.pages.analytics.title}
        title={t.pages.analytics.title}
        lead={t.pages.analytics.subtitle}
        actions={
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-soft">
            <TrendingUp className="h-6 w-6 text-gold" />
          </div>
        }
      />

      <SectionCard padded>
        <p className="text-center text-muted py-8">{t.pages.analytics.comingSoon}</p>
      </SectionCard>
    </div>
  );
}
