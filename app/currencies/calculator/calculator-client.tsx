"use client";

import React from "react";
import { SmartCurrencyCalculator } from "@/components/currency/smart-currency-calculator";
import { useLanguage } from "@/contexts/language-context";

export default function CalculatorPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl">
      {/* Sticky Title Section - Desktop Only */}
      <section className="md:sticky md:top-27.5 md:z-40 md:bg-background/95 md:backdrop-blur md:supports-backdrop-filter:bg-background/60 md:border-b md:border-border/40 md:-mx-8 md:px-8 md:py-4 md:mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 md:mb-0">
            <span>🧮</span>
            {t.pages.currencies.fullCalculator}
        </h2>
      </section>

      {/* Calculator Content */}
      <div className="md:mt-6">
        <SmartCurrencyCalculator />
      </div>
    </div>
  );
}
