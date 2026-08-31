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
            : 'Mersadna - Your trusted platform for tracking gold and currency prices in Egypt'}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* About Section */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            {isRTL ? 'عن مرصادنا' : 'About Mersadna'}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {isRTL
              ? 'مرصادنا هي منصة شاملة لمتابعة أسعار الذهب والعملات والعملات الرقمية في مصر. نوفر لك بيانات دقيقة ومحدثة لحظياً لمساعدتك في اتخاذ قرارات استثمارية مدروسة. نسعى لتقديم تجربة مستخدم متميزة مع أدوات حسابية ذكية وتحليلات شاملة للسوق.'
              : 'Mersadna is a comprehensive platform for tracking gold, currency, and cryptocurrency prices in Egypt. We provide accurate, real-time data to help you make informed investment decisions. We strive to deliver an exceptional user experience with smart calculation tools and comprehensive market analytics.'}
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
                ? 'توفير معلومات دقيقة وشفافة عن أسعار الذهب والعملات لجميع المستخدمين في مصر.'
                : 'Provide accurate and transparent information about gold and currency prices to all users in Egypt.'}
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
                ? 'أن نكون المنصة الأولى في مصر والشرق الأوسط لمتابعة أسعار الذهب والعملات.'
                : 'To be the leading platform in Egypt and the Middle East for tracking gold and currency prices.'}
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
                ? 'الشفافية، الدقة، الموثوقية، والابتكار في خدمة مستخدمينا.'
                : 'Transparency, accuracy, reliability, and innovation in serving our users.'}
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
                ? 'فريق متخصص من المطورين والمحللين الماليين يعمل على تقديم أفضل تجربة للمستخدمين.'
                : 'A specialized team of developers and financial analysts working to deliver the best user experience.'}
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
