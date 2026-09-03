'use client';

import { useState } from 'react';
import { PricingCard } from '@/components/pricing/pricing-card';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';

type BillingPeriod = 'monthly' | 'yearly';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const allFeatures = [
    'أسعار الذهب المباشرة',
    'أسعار العملات المباشرة',
    'أسعار الفضة المباشرة',
    'أسعار العملات الرقمية',
    'حاسبة شراء/بيع الذهب',
    'حاسبة تحويل العملات',
    'حاسبة الفضة والكريبتو',
    'حاسبة زكاة الذهب',
    'سجل الأسعار السابقة',
    'رؤى السوق الأساسية',
  ];

  const premiumOnlyFeatures = [
    'تنبيهات الأسعار والإشعارات',
    'مقارنة تجار الذهب',
    'الرسوم البيانية المتقدمة',
    'إدارة المحفظة',
    'تحديثات بيانات أسرع',
    'تجربة بدون إعلانات',
    'تصدير البيانات (CSV/Excel)',
    'إشعارات البريد الإلكتروني',
    'تحليلات السوق المتقدمة',
  ];

  const freeFeatures = allFeatures.map(text => ({ text, included: true }));

  const premiumFeatures = [
    ...allFeatures.map(text => ({ text, included: true })),
    ...premiumOnlyFeatures.map(text => ({ text, included: true }))
  ];

  const handleFreeClick = () => {
    console.log('Free plan selected - Redirect to signup');
  };

  const handlePremiumClick = () => {
    console.log('Premium plan selected - Redirect to payment');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="خطط الاشتراك" className="py-0 pb-0 md:py-0 md:pb-0" />

      {/* Billing Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            billingPeriod === 'monthly'
              ? 'bg-gold text-on-gold'
              : 'bg-panel2 text-muted hover:bg-hover'
          )}
        >
          شهري
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1',
            billingPeriod === 'yearly'
              ? 'bg-gold text-on-gold'
              : 'bg-panel2 text-muted hover:bg-hover'
          )}
        >
          سنوي
          <span className="text-[10px] bg-up-soft text-up px-1.5 py-0.5 rounded">
            وفر 20%
          </span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Plan */}
        <PricingCard
          title="مجاني"
          price="0"
          period={billingPeriod === 'monthly' ? '/شهر' : '/سنة'}
          description="مثالي لمتابعة أسعار الذهب والعملات بشكل أساسي"
          features={freeFeatures}
          isPremium={false}
          ctaText="ابدأ مجاناً"
          onCtaClick={handleFreeClick}
        />

        {/* Premium Plan */}
        <PricingCard
          title="بريميوم"
          price={billingPeriod === 'monthly' ? '$9.99' : '$99'}
          period={billingPeriod === 'monthly' ? '/شهر' : '/سنة'}
          description="جميع الميزات للمحترفين والمستثمرين"
          features={premiumFeatures}
          isPremium={true}
          ctaText="ترقية للبريميوم"
          onCtaClick={handlePremiumClick}
        />
      </div>

      {/* Footer Note */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted">
          يمكن إلغاء الاشتراك في أي وقت • جميع الخطط تشمل الدعم الفني
        </p>
      </div>
    </div>
  );
}
