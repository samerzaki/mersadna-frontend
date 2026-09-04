'use client';

import { AlertCircle, Bell, Calculator } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useAllSilverPrices } from '@/hooks/use-silver-prices';
import { SilverAllPricesItem } from '@/types';
import { formatPriceWithCurrency } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { Sparkline } from '@/components/ui/sparkline';
import { SectionCard } from '@/components/ui/section-card';
import { ChangeText } from '@/components/ui/change-badge';

const SILVER_NAMES: Record<string, { ar: string; en: string }> = {
  '11': { ar: 'فضة 999 سويسري', en: 'Silver 999 Swiss' },
  '15': { ar: 'فضة 999 مصري', en: 'Silver 999 Egyptian' },
  '16': { ar: 'فضة 980', en: 'Silver 980' },
  '17': { ar: 'فضة 925', en: 'Silver 925' },
  '18': { ar: 'فضة 800', en: 'Silver 800' },
  '19': { ar: 'أونصة الفضة العالمية', en: 'Global Silver Ounce' },
  '800': { ar: 'فضة 800', en: 'Silver 800' },
  '925': { ar: 'فضة 925', en: 'Silver 925' },
  '999_swiss': { ar: 'فضة 999 سويسري', en: 'Silver 999 Swiss' },
  '999_egyptian': { ar: 'فضة 999 مصري', en: 'Silver 999 Egyptian' },
  ounce: { ar: 'أونصة الفضة العالمية', en: 'Global Silver Ounce' },
};

interface SilverDataItem {
  id: string;
  name: string;
  sellPrice: number;
  buyPrice: number;
  changePercent: number;
  chartPoints: number[];
  currency: string;
}

function transformApiItem(key: string, data: SilverAllPricesItem, isRTL: boolean): SilverDataItem {
  return {
    id: key,
    name: SILVER_NAMES[key]?.[isRTL ? 'ar' : 'en'] ?? (isRTL ? `فضة ${key}` : `Silver ${key}`),
    sellPrice: data.sell_price,
    buyPrice: data.buy_price,
    changePercent: data.spread_percent,
    chartPoints: data.chart_points ?? [],
    currency: data.currency,
  };
}

function TableSkeleton() {
  return (
    <SectionCard title="Silver prices" className="overflow-x-auto">
      <div className="min-w-[720px] space-y-px bg-line2">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="grid grid-cols-5 gap-4 bg-panel px-5 py-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default function SilverPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const locale = isRTL ? 'ar-EG' : 'en-US';
  const direction = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'right' : 'left';
  const { data, isLoading, error } = useAllSilverPrices('EGP', '30d');

  const silverItems: SilverDataItem[] = [];
  if (data?.data?.silver) {
    Object.entries(data.data.silver).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'sell_price' in value) {
        silverItems.push(transformApiItem(key, value as SilverAllPricesItem, isRTL));
      }
    });
  }

  const features = [
    { icon: Calculator, title: isRTL ? 'حاسبة الفضة' : 'Silver Calculator', description: isRTL ? 'احسب قيمة الفضة بالوزن' : 'Calculate silver value by weight', href: '/silver/calculator' },
    { icon: Bell, title: isRTL ? 'تنبيهات الأسعار' : 'Price Alerts', description: isRTL ? 'احصل على إشعارات عند تغير الأسعار' : 'Get notified on price changes', href: '/me/alerts' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isRTL ? 'الفضة' : 'Silver'}
        title={isRTL ? 'أسعار الفضة' : 'Silver Prices'}
        lead={isRTL ? 'أسعار الفضة المحدثة لحظياً - جميع الأنواع' : 'Live silver prices - All types'}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : error || !data ? (
        <div className="card-surface p-6 border border-down/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-down" />
            <div>
              <h3 className="font-semibold text-text">{isRTL ? 'خطأ في تحميل البيانات' : 'Error loading data'}</h3>
              <p className="text-sm text-muted">{error instanceof Error ? error.message : (isRTL ? 'فشل في تحميل أسعار الفضة' : 'Failed to load silver prices')}</p>
            </div>
          </div>
        </div>
      ) : (
        <SectionCard title={isRTL ? 'جدول أسعار الفضة' : 'Silver price table'} className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div
              className="grid items-center px-[22px] py-3.5 bg-panel2 text-[12px] text-muted"
              style={{ gridTemplateColumns: '1.25fr 1fr 1fr 0.75fr 0.8fr', direction }}
            >
              <span style={{ textAlign: align }}>{isRTL ? 'النوع' : 'Type'}</span>
              <span style={{ textAlign: align }}>{t.gold.sellPrice}</span>
              <span style={{ textAlign: align }}>{t.gold.buyPrice}</span>
              <span style={{ textAlign: align }}>{t.gold.changeColumn}</span>
              <span className="text-end">{t.gold.days30Column}</span>
            </div>
            {silverItems.map((item) => {
              const isOunce = item.id === '19' || item.id === 'ounce';
              return (
                <div
                  key={item.id}
                  className="grid items-center px-[22px] py-4 border-t border-[var(--line2)] hover:bg-hover transition-colors"
                  style={{ gridTemplateColumns: '1.25fr 1fr 1fr 0.75fr 0.8fr', direction }}
                >
                  <span className="font-heading text-[15px] text-text" style={{ textAlign: align }}>{item.name}</span>
                  <span className="num text-[16px] md:text-[18px] text-text" style={{ textAlign: align }}>{formatPriceWithCurrency(item.sellPrice, item.currency, locale)}</span>
                  <span className="num text-[16px] md:text-[18px] text-muted" style={{ textAlign: align }}>{formatPriceWithCurrency(item.buyPrice, item.currency, locale)}</span>
                  <span style={{ textAlign: align }}><ChangeText value={item.changePercent} direction={direction} /></span>
                  <span className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    {item.chartPoints.length > 1 ? <Sparkline data={item.chartPoints} width={64} height={22} tone={isOunce ? 'gold' : 'auto'} /> : <span className="text-dim">—</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="group card-surface p-6 hover:shadow-gold transition-shadow">
            <div className="inline-flex p-3 rounded-lg bg-gold-soft mb-4"><feature.icon className="h-6 w-6 text-gold" /></div>
            <h3 className="font-heading text-lg font-bold text-text mb-2 group-hover:text-gold transition-colors">{feature.title}</h3>
            <p className="text-sm text-muted">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
