'use client';

import { useLanguage } from '@/contexts/language-context';
import { FileText, AlertTriangle, Scale, Ban, Shield, UserX } from 'lucide-react';
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

export default function TermsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <ArticleLayout
      title={isRTL ? 'الشروط والأحكام' : 'Terms and Conditions'}
      lastUpdated={isRTL ? 'آخر تحديث: يناير 2026' : 'Last updated: January 2026'}
    >
      <p className="text-[16px] leading-[2] text-muted">
        {isRTL
          ? 'مرحباً بك في قدامك. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.'
          : 'Welcome to Odamak. By using this platform, you agree to comply with the following terms and conditions. Please read them carefully.'}
      </p>

      <section>
        <SectionHeading icon={FileText}>{isRTL ? 'قبول الشروط' : 'Acceptance of Terms'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'باستخدامك لمنصة قدامك، فإنك توافق على هذه الشروط والأحكام وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.'
            : 'By using the Odamak platform, you agree to these terms and conditions and our privacy policy. If you do not agree with any of these terms, please do not use the platform.'}
        </p>
      </section>

      <section>
        <SectionHeading icon={Scale}>{isRTL ? 'وصف الخدمة' : 'Service Description'}</SectionHeading>
        <p className="mb-3 text-[15px] leading-[1.9] text-muted">
          {isRTL ? 'قدامك منصة معلوماتية توفر:' : 'Odamak is an information platform that provides:'}
        </p>
        <ul className="space-y-2 text-[15px] leading-[1.9] text-muted">
          <Bullet>{isRTL ? 'أسعار الذهب والعملات والعملات الرقمية' : 'Gold, currency, and cryptocurrency prices'}</Bullet>
          <Bullet>{isRTL ? 'أدوات حسابية ومحولات' : 'Calculation tools and converters'}</Bullet>
          <Bullet>{isRTL ? 'تحليلات ورسوم بيانية للأسعار' : 'Price analytics and charts'}</Bullet>
        </ul>
      </section>

      <section className="rounded-[14px] border border-gold-line bg-panel2 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-on-gold">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-[18px] font-semibold text-text">
            {isRTL ? 'إخلاء المسؤولية' : 'Disclaimer'}
          </h2>
        </div>
        <div className="space-y-3 text-[15px] leading-[1.9] text-muted">
          <p>
            {isRTL
              ? 'الأسعار المعروضة على المنصة هي للإشارة فقط ويتم تحديثها دورياً. قد تختلف الأسعار الفعلية.'
              : 'Prices displayed on the platform are for reference only and updated periodically. Actual prices may vary.'}
          </p>
          <p className="font-semibold text-text">
            {isRTL
              ? 'قدامك ليس مسؤولاً عن أي قرارات استثمارية أو تداول تتخذها بناءً على المعلومات المقدمة.'
              : 'Odamak is not responsible for any investment or trading decisions you make based on the information provided.'}
          </p>
          <p>
            {isRTL
              ? 'يرجى استشارة مستشار مالي مؤهل قبل اتخاذ أي قرارات استثمارية.'
              : 'Please consult a qualified financial advisor before making any investment decisions.'}
          </p>
        </div>
      </section>

      <section>
        <SectionHeading icon={Shield}>{isRTL ? 'مسؤوليات المستخدم' : 'User Responsibilities'}</SectionHeading>
        <ul className="space-y-2 text-[15px] leading-[1.9] text-muted">
          <Bullet>{isRTL ? 'استخدام المنصة بطريقة قانونية ومسؤولة' : 'Use the platform legally and responsibly'}</Bullet>
          <Bullet>
            {isRTL
              ? 'عدم إساءة استخدام الخدمات أو محاولة اختراق النظام'
              : 'Do not misuse services or attempt to breach the system'}
          </Bullet>
          <Bullet>{isRTL ? 'الحفاظ على سرية معلومات حسابك' : 'Maintain confidentiality of your account information'}</Bullet>
          <Bullet>
            {isRTL ? 'عدم نسخ أو إعادة نشر المحتوى دون إذن' : 'Do not copy or republish content without permission'}
          </Bullet>
        </ul>
      </section>

      <section>
        <SectionHeading icon={Ban}>{isRTL ? 'الاستخدامات المحظورة' : 'Prohibited Uses'}</SectionHeading>
        <ul className="space-y-2 text-[15px] leading-[1.9] text-muted">
          <Bullet>{isRTL ? 'نشر محتوى غير قانوني أو مسيء' : 'Posting illegal or offensive content'}</Bullet>
          <Bullet>{isRTL ? 'محاولة الوصول غير المصرح به' : 'Attempting unauthorized access'}</Bullet>
          <Bullet>
            {isRTL ? 'استخدام البيانات لأغراض تجارية بدون إذن' : 'Using data for commercial purposes without permission'}
          </Bullet>
          <Bullet>{isRTL ? 'إزعاج المستخدمين الآخرين' : 'Harassing other users'}</Bullet>
        </ul>
      </section>

      <section>
        <SectionHeading icon={UserX}>{isRTL ? 'إنهاء الحساب' : 'Account Termination'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط أو الاشتباه في سوء استخدام المنصة.'
            : 'We reserve the right to suspend or terminate your account in case of violation of these terms or suspected platform misuse.'}
        </p>
      </section>

      <section>
        <SectionHeading icon={Shield}>{isRTL ? 'الملكية الفكرية' : 'Intellectual Property'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'جميع المحتويات والتصاميم والشعارات على المنصة هي ملكية خاصة لقدامك ومحمية بموجب قوانين حقوق الملكية الفكرية.'
            : 'All content, designs, and logos on the platform are proprietary to Odamak and protected under intellectual property laws.'}
        </p>
      </section>

      <section>
        <SectionHeading icon={FileText}>{isRTL ? 'تعديل الشروط' : 'Changes to Terms'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر المنصة أو البريد الإلكتروني.'
            : 'We reserve the right to modify these terms at any time. You will be notified of any material changes via the platform or email.'}
        </p>
      </section>

      <section>
        <SectionHeading icon={Scale}>{isRTL ? 'القانون الحاكم' : 'Governing Law'}</SectionHeading>
        <p className="text-[15px] leading-[1.9] text-muted">
          {isRTL
            ? 'تخضع هذه الشروط والأحكام لقوانين جمهورية مصر العربية.'
            : 'These terms and conditions are governed by the laws of the Arab Republic of Egypt.'}
        </p>
      </section>

      <div className="border-t border-line pt-6 text-center">
        <p className="mb-2 text-[15px] text-muted">
          {isRTL ? 'لديك أسئلة حول الشروط والأحكام؟' : 'Have questions about the terms and conditions?'}
        </p>
        <a href="/contact" className="text-gold underline-offset-4 hover:underline">
          {isRTL ? 'تواصل معنا' : 'Contact us'}
        </a>
      </div>
    </ArticleLayout>
  );
}
