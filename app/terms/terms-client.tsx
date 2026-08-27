'use client';

import { useLanguage } from '@/contexts/language-context';
import { FileText, AlertTriangle, Scale, Ban, Shield, UserX } from 'lucide-react';

export default function TermsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {isRTL ? 'الشروط والأحكام' : 'Terms and Conditions'}
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
            ? 'مرحباً بك في نِزِل ذهب. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.'
            : 'Welcome to Nezzel Gold. By using this platform, you agree to comply with the following terms and conditions. Please read them carefully.'}
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6">
        {/* Acceptance */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'قبول الشروط' : 'Acceptance of Terms'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'باستخدامك لمنصة نِزِل ذهب، فإنك توافق على هذه الشروط والأحكام وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.'
              : 'By using the Nezzel Gold platform, you agree to these terms and conditions and our privacy policy. If you do not agree with any of these terms, please do not use the platform.'}
          </p>
        </section>

        {/* Service Description */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'وصف الخدمة' : 'Service Description'}
            </h2>
          </div>
          <p className="mb-3 text-muted-foreground">
            {isRTL
              ? 'نِزِل ذهب منصة معلوماتية توفر:'
              : 'Nezzel Gold is an information platform that provides:'}
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'أسعار الذهب والعملات والعملات الرقمية'
                  : 'Gold, currency, and cryptocurrency prices'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'أدوات حسابية ومحولات'
                  : 'Calculation tools and converters'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'تحليلات ورسوم بيانية للأسعار'
                  : 'Price analytics and charts'}
              </span>
            </li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="rounded-lg border border-orange-200 bg-orange-50/30 p-6 dark:border-orange-900/50 dark:bg-orange-950/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-500">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-orange-900 dark:text-orange-100">
              {isRTL ? 'إخلاء المسؤولية' : 'Disclaimer'}
            </h2>
          </div>
          <div className="space-y-3 text-orange-800 dark:text-orange-200">
            <p>
              {isRTL
                ? 'الأسعار المعروضة على المنصة هي للإشارة فقط ويتم تحديثها دورياً. قد تختلف الأسعار الفعلية.'
                : 'Prices displayed on the platform are for reference only and updated periodically. Actual prices may vary.'}
            </p>
            <p className="font-semibold">
              {isRTL
                ? 'نِزِل ذهب ليس مسؤولاً عن أي قرارات استثمارية أو تداول تتخذها بناءً على المعلومات المقدمة.'
                : 'Nezzel Gold is not responsible for any investment or trading decisions you make based on the information provided.'}
            </p>
            <p>
              {isRTL
                ? 'يرجى استشارة مستشار مالي مؤهل قبل اتخاذ أي قرارات استثمارية.'
                : 'Please consult a qualified financial advisor before making any investment decisions.'}
            </p>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'مسؤوليات المستخدم' : 'User Responsibilities'}
            </h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'استخدام المنصة بطريقة قانونية ومسؤولة'
                  : 'Use the platform legally and responsibly'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'عدم إساءة استخدام الخدمات أو محاولة اختراق النظام'
                  : 'Do not misuse services or attempt to breach the system'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'الحفاظ على سرية معلومات حسابك'
                  : 'Maintain confidentiality of your account information'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'عدم نسخ أو إعادة نشر المحتوى دون إذن'
                  : 'Do not copy or republish content without permission'}
              </span>
            </li>
          </ul>
        </section>

        {/* Prohibited Uses */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500">
              <Ban className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'الاستخدامات المحظورة' : 'Prohibited Uses'}
            </h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'نشر محتوى غير قانوني أو مسيء'
                  : 'Posting illegal or offensive content'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'محاولة الوصول غير المصرح به'
                  : 'Attempting unauthorized access'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'استخدام البيانات لأغراض تجارية بدون إذن'
                  : 'Using data for commercial purposes without permission'}
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                {isRTL
                  ? 'إزعاج المستخدمين الآخرين'
                  : 'Harassing other users'}
              </span>
            </li>
          </ul>
        </section>

        {/* Account Termination */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4">
              <UserX className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'إنهاء الحساب' : 'Account Termination'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط أو الاشتباه في سوء استخدام المنصة.'
              : 'We reserve the right to suspend or terminate your account in case of violation of these terms or suspected platform misuse.'}
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'الملكية الفكرية' : 'Intellectual Property'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'جميع المحتويات والتصاميم والشعارات على المنصة هي ملكية خاصة لنِزِل ذهب ومحمية بموجب قوانين حقوق الملكية الفكرية.'
              : 'All content, designs, and logos on the platform are proprietary to Nezzel Gold and protected under intellectual property laws.'}
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'تعديل الشروط' : 'Changes to Terms'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر المنصة أو البريد الإلكتروني.'
              : 'We reserve the right to modify these terms at any time. You will be notified of any material changes via the platform or email.'}
          </p>
        </section>

        {/* Governing Law */}
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">
              {isRTL ? 'القانون الحاكم' : 'Governing Law'}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isRTL
              ? 'تخضع هذه الشروط والأحكام لقوانين جمهورية مصر العربية.'
              : 'These terms and conditions are governed by the laws of the Arab Republic of Egypt.'}
          </p>
        </section>
      </div>

      {/* Contact */}
      <div className="mt-8 rounded-lg border bg-muted/30 p-6 text-center">
        <p className="mb-2 text-lg">
          {isRTL
            ? 'لديك أسئلة حول الشروط والأحكام؟'
            : 'Have questions about the terms and conditions?'}
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
