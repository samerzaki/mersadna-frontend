'use client';

import Link from 'next/link';
import { SectionCard } from '@/components/ui/section-card';
import { LiveDot } from '@/components/ui/live-dot';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeText } from '@/components/ui/change-badge';
import { MonoNumber } from '@/components/ui/mono-number';
import { useLanguage } from '@/contexts/language-context';
import type { CryptoPrice } from '@/types';

interface CryptoWidgetClientProps {
  cryptos: CryptoPrice[];
}

function CryptoRow({ crypto }: { crypto: CryptoPrice }) {
  const { language } = useLanguage();
  const displayName = language === 'ar' ? crypto.nameAr || crypto.name : crypto.name;

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-line2 last:border-b-0">
      <LiveDot tone="gold" size={6} />
      <div className="flex-1 min-w-0">
        <span className="num text-[13px] font-semibold text-text">{crypto.symbol}</span>
        <span className="ms-1.5 text-[12px] text-dim truncate">{displayName}</span>
      </div>
      <MonoNumber
        value={crypto.price_usd}
        currency="USD"
        locale="en-US"
        className="text-[15px] font-medium text-text whitespace-nowrap"
      />
      {crypto.chart_points.length >= 2 ? (
        <Sparkline data={crypto.chart_points} width={48} height={16} tone="auto" />
      ) : (
        <span className="w-12" />
      )}
      <span className="w-[56px] text-end shrink-0">
        <ChangeText value={crypto.change_24h} withArrow={false} className="text-[11.5px]" />
      </span>
    </div>
  );
}

export function CryptoWidgetClient({ cryptos }: CryptoWidgetClientProps) {
  const { t } = useLanguage();

  return (
    <SectionCard
      title={t.home2026.crypto}
      action={
        <Link href="/crypto" className="text-[13px] text-gold hover:opacity-75 transition-opacity">
          {t.home2026.details}
        </Link>
      }
    >
      {cryptos && cryptos.length > 0 ? (
        <>
          <div>
            {cryptos.map((crypto) => (
              <CryptoRow key={crypto.id} crypto={crypto} />
            ))}
          </div>
        </>
      ) : (
        <div className="px-5 py-6 text-center text-[13px] text-muted">{t.home2026.noData}</div>
      )}
    </SectionCard>
  );
}
