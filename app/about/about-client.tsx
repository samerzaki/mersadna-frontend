'use client';

import { useLanguage } from '@/contexts/language-context';
import { Coins, Target, Users, Award } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {isRTL ? 'من نحن' : 'About Us'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isRTL
            ? 'منصة مرصادنا - وجهتك الموثوقة لمتابعة أسعار الذهب والعملات في مصر'
            : 'Odamak - Your trusted platform for tracking gold and currency prices in Egypt'}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* About Section */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            {isRTL ? 'عن مرصادنا' : 'About Odamak'}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {isRTL
              ? 'مرصادنا منصة عربية لمتابعة أسعار الذهب والعملات والفضة والعملات الرقمية في مصر. ننظم البيانات المتاحة ونقدم أدوات حسابية ورسومًا تساعدك على قراءة السوق بصورة أوضح.'
              : 'Odamak is an Arabic platform for following gold, currency, silver, and cryptocurrency prices in Egypt, with clear market data and practical calculation tools.'}
          </p>
        </section>

        {/* Features Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Mission */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">
                {isRTL ? 'رسالتنا' : 'Our Mission'}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {isRTL
                ? 'تقديم بيانات سوق منظمة وسهلة القراءة، مع توضيح وقت التحديث وحدود الاستخدام.'
                : 'Present market data clearly, including update times and usage limitations.'}
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1">
                <Award className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">
                {isRTL ? 'رؤيتنا' : 'Our Vision'}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {isRTL
                ? 'تسهيل الوصول إلى معلومات السوق والأدوات العملية للمستخدم العربي.'
                : 'Make market information and practical tools easier for Arabic-speaking users to access.'}
            </p>
          </div>

          {/* Values */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2">
                <Coins className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">
                {isRTL ? 'قيمنا' : 'Our Values'}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {isRTL
                ? 'الوضوح، البساطة، واحترام اختلاف الأسعار الفعلية بين الجهات والأسواق.'
                : 'Clarity, simplicity, and respect for differences between reference and final market prices.'}
            </p>
          </div>

          {/* Team */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">
                {isRTL ? 'فريقنا' : 'Our Team'}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {isRTL
                ? 'نعمل على تطوير تجربة المتابعة والأدوات باستمرار بناءً على احتياجات المستخدمين.'
                : 'We continuously improve the tracking experience and tools based on user needs.'}
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="rounded-lg border bg-muted/30 p-6 text-center">
          <p className="mb-2 text-lg">
            {isRTL ? 'هل لديك أسئلة أو اقتراحات؟' : 'Have questions or suggestions?'}
          </p>
          <a
            href="/contact"
            className="text-gold-500 underline-offset-4 hover:underline"
          >
            {isRTL ? 'تواصل معنا' : 'Contact us'}
          </a>
        </div>
      </div>
    </div>
  );
}
