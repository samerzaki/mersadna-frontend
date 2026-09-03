import { ModernGoldPricesServer, ModernGoldPricesSkeleton } from '@/components/dashboard/modern-gold-prices-server';
import { UnifiedGoldChartServer } from '@/components/charts/unified-gold-chart-server';
import { AutoRefreshWrapper } from '@/components/dashboard/auto-refresh-wrapper';
import { GoldExtraCards } from '@/components/gold/gold-extra-cards';
import { PageHeader } from '@/components/ui/page-header';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { MarketGuidance } from '@/components/seo/market-guidance';

export const metadata: Metadata = buildMetadata('gold', { canonicalPath: '/gold' });
export const revalidate = 60;

export default function GoldPricesPage() {
  return (
    <AutoRefreshWrapper>
      <div className="space-y-8">
        <PageHeader
          eyebrow="سوق الذهب"
          title="أسعار الذهب التفصيلية"
          lead="راقب أسعار عيارات الذهب الرئيسية بالجنيه المصري، ثم انتقل إلى الرسم البياني أو الحاسبة لمعرفة القيمة التقديرية حسب الوزن والعيار."
        />

        <Suspense fallback={<ModernGoldPricesSkeleton />}>
          <ModernGoldPricesServer />
        </Suspense>

        <GoldExtraCards />

        {/* Price History Chart */}
        <UnifiedGoldChartServer />

        <MarketGuidance
          title="قراءة سعر الذهب اليوم"
          intro="يعرض القسم السعر المرجعي لكل عيار وحركته الأخيرة. استخدم الصفحات الخاصة بالعيارات لمعرفة النقاء ومراجعة السجل، ثم استخدم الحاسبة لتقدير التكلفة حسب الوزن."
          points={[
            'عيار 24 أعلى نقاءً، بينما عيار 21 من أكثر العيارات تداولاً في مصر.',
            'سعر الجرام لا يشمل بالضرورة المصنعية أو الضريبة أو هامش التاجر.',
            'التغير اليومي يوضح حركة السعر مقارنة بالقراءة السابقة ولا يمثل توقعاً مستقبلياً.',
          ]}
          questions={[
            { question: 'لماذا يختلف سعر الذهب من متجر لآخر؟', answer: 'قد تختلف المصنعية وهامش التاجر والخدمات الإضافية، بينما يبقى سعر المعدن المرجعي نقطة بداية للمقارنة.' },
            { question: 'كيف أحسب قيمة قطعة ذهب؟', answer: 'اضرب وزنها في سعر الجرام للعيار المناسب، ثم أضف المصنعية والضرائب أو الرسوم المعلنة.' },
          ]}
        />
      </div>
    </AutoRefreshWrapper>
  );
}
