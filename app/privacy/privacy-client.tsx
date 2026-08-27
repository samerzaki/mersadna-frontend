'use client';

import { useLanguage } from '@/contexts/language-context';
import { Shield, Lock, Eye, UserCheck, Cookie, Database } from 'lucide-react';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL
            ? 'آخر تحديث: يناير 2026'
            : 'Last updated: January 2026'}
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-8 rounded-lg border bg-card p-6">
        <p className="leading-relaxed text-muted-foreground">
          {isRTL
            ? 'في نِزِل ذهب، نحن ملتزمون بحماية خصوصيتك وأمان بياناتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام منصتنا.'
            : 'At Nezzel Gold, we are committed to protecting your privacy and data security. This policy explains how we collect, use, and protect your personal information when using our platform.'}
        </p>
      </div>

      {/* Privacy Sections */}
      <div className="space-y-6">
        {/* Data Collection */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'البيانات التي نجمعها' : 'Data We Collect'}
            </h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'معلومات الاستخدام: صفحات الويب التي تزورها، الوقت المستغرق، والتفاعلات'
                  : 'Usage information: web pages visited, time spent, and interactions'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'معلومات الجهاز: نوع المتصفح، نظام التشغيل، وعنوان IP'
                  : 'Device information: browser type, operating system, and IP address'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'معلومات الحساب: البريد الإلكتروني والاسم (إذا قمت بإنشاء حساب)'
                  : 'Account information: email and name (if you create an account)'}
              </span>
            </li>
          </ul>
        </section>

        {/* Data Usage */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1">
              <Eye className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'كيف نستخدم بياناتك' : 'How We Use Your Data'}
            </h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'تحسين وتطوير خدماتنا ومنتجاتنا'
                  : 'Improve and develop our services and products'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'تقديم محتوى وتجربة مخصصة لك'
                  : 'Provide personalized content and experience'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'التواصل معك بشأن التحديثات والعروض'
                  : 'Communicate with you about updates and offers'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'تحليل استخدام المنصة وتحسين الأداء'
                  : 'Analyze platform usage and improve performance'}
              </span>
            </li>
          </ul>
        </section>

        {/* Data Protection */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'حماية البيانات' : 'Data Protection'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'نستخدم تدابير أمنية متقدمة لحماية بياناتك من الوصول غير المصرح به، والتعديل، أو الإفصاح. جميع البيانات الحساسة مشفرة باستخدام بروتوكولات SSL/TLS.'
              : 'We use advanced security measures to protect your data from unauthorized access, modification, or disclosure. All sensitive data is encrypted using SSL/TLS protocols.'}
          </p>
        </section>

        {/* Cookies */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4">
              <Cookie className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'ملفات تعريف الارتباط (Cookies)' : 'Cookies'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.'
              : 'We use cookies to improve your experience on the platform. You can control cookie settings through your browser.'}
          </p>
        </section>

        {/* User Rights */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1">
              <UserCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'حقوقك' : 'Your Rights'}
            </h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'الوصول إلى بياناتك الشخصية'
                  : 'Access your personal data'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'تصحيح أو تحديث معلوماتك'
                  : 'Correct or update your information'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'حذف حسابك وبياناتك'
                  : 'Delete your account and data'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'الاعتراض على معالجة بياناتك'
                  : 'Object to processing of your data'}
              </span>
            </li>
          </ul>
        </section>

        {/* Third Party */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'مشاركة البيانات' : 'Data Sharing'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'لا نبيع أو نشارك بياناتك الشخصية مع أطراف ثالثة للأغراض التسويقية. قد نشارك البيانات فقط مع مزودي الخدمة الموثوقين لتشغيل المنصة.'
              : 'We do not sell or share your personal data with third parties for marketing purposes. We may only share data with trusted service providers to operate the platform.'}
          </p>
        </section>
      </div>

      {/* Contact */}
      <div className="mt-8 rounded-lg border bg-muted/30 p-6 text-center">
        <p className="mb-2 text-lg">
          {isRTL
            ? 'لديك أسئلة حول خصوصيتك؟'
            : 'Have questions about your privacy?'}
        </p>
        <a
          href="/contact"
          className="text-gold-500 underline-offset-4 hover:underline"
        >
          {isRTL ? 'تواصل معنا' : 'Contact us'}
        </a>
      </div>
    </div>
  );
}
