'use client';

import { useLanguage } from '@/contexts/language-context';
import { Shield, Lock, Eye, UserCheck, Cookie, Database } from 'lucide-react';
import { ArticleLayout } from '@/components/ui/article-layout';

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-gold">•</span>
      <span>{children}</span>
    </li>
  );
}

function SectionHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-on-gold">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-heading text-[18px] font-semibold text-text">{children}</h2>
    </div>
  );
}

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <ArticleLayout
      title={isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
      lastUpdated={isRTL ? 'آخر تحديث: يناير 2026' : 'Last updated: January 2026'}
    >
      <p className="text-[16px] leading-[2] text-muted">
        {isRTL
          ? 'في قدامك، نحن ملتزمون بحماية خصوصيتك وأمان بياناتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام منصتنا.'
          : 'At Odamak, we are committed to protecting your privacy and data security. This policy explains how we collect, use, and protect your personal information when using our platform.'}
      </p>

      <section>
        <SectionHeading icon={Database}>{isRTL ? 'البيانات التي نجمعها' : 'Data We Collect'}</SectionHeading>
        <ul className="space-y-2 text-[15px] leading-[1.9] text-muted">
          <Bullet>
            {isRTL
              ? 'معلومات الاستخدام: صفحات الويب التي تزورها، الوقت المستغرق، والتفاعلات'
              : 'Usage information: web pages visited, time spent, and interactions'}
          </Bullet>
          <Bullet>
            {isRTL
              ? 'معلومات الجهاز: نوع المتصفح، نظام التشغيل، وعنوان IP'
              : 'Device information: browser type, operating system, and IP address'}
          </Bullet>
          <Bullet>
            {isRTL
              ? 'معلومات الحساب: البريد الإلكتروني والاسم (إذا قمت بإنشاء حساب)'
              : 'Account information: email and name (if you create an account)'}
          </Bullet>
        </ul>
      </section>

      <section>
        <SectionHeading icon={Eye}>{isRTL ? 'كيف نستخدم بياناتك' : 'How We Use Your Data'}</SectionHeading>
        <ul className="space-y-2 text-[15px] leading-[1.9] text-muted">
          <Bullet>{isRTL ? 'تحسين وتطوير خدماتنا ومنتجاتنا' : 'Improve and develop our services and products'}</Bullet>
          <Bullet>{isRTL ? 'تقديم محتوى وتجربة مخصصة لك' : 'Provide personalized content and experience'}</Bullet>
          <Bullet>{isRTL ? 'التواصل معك بشأن التحديثات والعروض' : 'Communicate with you about updates and offers'}</Bullet>
          <Bullet>{isRTL ? 'تحليل استخدام المنصة وتحسين الأداء' : 'Analyze platform usage and improve performance'}</Bullet>
        </ul>
      </section>

      <section>
        <SectionHeading icon={Shield}>{isRTL ? 'حماية البيانات' : 'Data Protection'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'نستخدم تدابير أمنية متقدمة لحماية بياناتك من الوصول غير المصرح به، والتعديل، أو الإفصاح. جميع البيانات الحساسة مشفرة باستخدام بروتوكولات SSL/TLS.'
            : 'We use advanced security measures to protect your data from unauthorized access, modification, or disclosure. All sensitive data is encrypted using SSL/TLS protocols.'}
        </p>
      </section>

      <section>
        <SectionHeading icon={Cookie}>{isRTL ? 'ملفات تعريف الارتباط (Cookies)' : 'Cookies'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.'
            : 'We use cookies to improve your experience on the platform. You can control cookie settings through your browser.'}
        </p>
      </section>

      <section>
        <SectionHeading icon={UserCheck}>{isRTL ? 'حقوقك' : 'Your Rights'}</SectionHeading>
        <ul className="space-y-2 text-[15px] leading-[1.9] text-muted">
          <Bullet>{isRTL ? 'الوصول إلى بياناتك الشخصية' : 'Access your personal data'}</Bullet>
          <Bullet>{isRTL ? 'تصحيح أو تحديث معلوماتك' : 'Correct or update your information'}</Bullet>
          <Bullet>{isRTL ? 'حذف حسابك وبياناتك' : 'Delete your account and data'}</Bullet>
          <Bullet>{isRTL ? 'الاعتراض على معالجة بياناتك' : 'Object to processing of your data'}</Bullet>
        </ul>
      </section>

      <section>
        <SectionHeading icon={Lock}>{isRTL ? 'مشاركة البيانات' : 'Data Sharing'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'لا نبيع أو نشارك بياناتك الشخصية مع أطراف ثالثة للأغراض التسويقية. قد نشارك البيانات فقط مع مزودي الخدمة الموثوقين لتشغيل المنصة.'
            : 'We do not sell or share your personal data with third parties for marketing purposes. We may only share data with trusted service providers to operate the platform.'}
        </p>
      </section>

      <div className="border-t border-line pt-6 text-center">
        <p className="mb-2 text-[15px] text-muted">
          {isRTL ? 'لديك أسئلة حول خصوصيتك؟' : 'Have questions about your privacy?'}
        </p>
        <a href="/contact" className="text-gold underline-offset-4 hover:underline">
          {isRTL ? 'تواصل معنا' : 'Contact us'}
        </a>
      </div>
    </ArticleLayout>
  );
}
