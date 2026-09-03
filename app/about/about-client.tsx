'use client';

import { useLanguage } from '@/contexts/language-context';
import { Coins, Target, Users, Award } from 'lucide-react';
import { ArticleLayout } from '@/components/ui/article-layout';

const items = [
  {
    icon: Target,
    ar: { title: 'رسالتنا', body: 'تقديم بيانات سوق منظمة وسهلة القراءة، مع توضيح وقت التحديث وحدود الاستخدام.' },
    en: { title: 'Our Mission', body: 'Present market data clearly, including update times and usage limitations.' },
  },
  {
    icon: Award,
    ar: { title: 'رؤيتنا', body: 'تسهيل الوصول إلى معلومات السوق والأدوات العملية للمستخدم العربي.' },
    en: { title: 'Our Vision', body: 'Make market information and practical tools easier for Arabic-speaking users to access.' },
  },
  {
    icon: Coins,
    ar: { title: 'قيمنا', body: 'الوضوح، البساطة، واحترام اختلاف الأسعار الفعلية بين الجهات والأسواق.' },
    en: { title: 'Our Values', body: 'Clarity, simplicity, and respect for differences between reference and final market prices.' },
  },
  {
    icon: Users,
    ar: { title: 'فريقنا', body: 'نعمل على تطوير تجربة المتابعة والأدوات باستمرار بناءً على احتياجات المستخدمين.' },
    en: { title: 'Our Team', body: 'We continuously improve the tracking experience and tools based on user needs.' },
  },
];

export default function AboutPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <ArticleLayout
      title={isRTL ? 'من نحن' : 'About Us'}
      lead={
        isRTL
          ? 'منصة قدامك - وجهتك الموثوقة لمتابعة أسعار الذهب والعملات في مصر'
          : 'Odamak - Your trusted platform for tracking gold and currency prices in Egypt'
      }
    >
      <section>
        <h2 className="mb-3 font-heading text-[19px] font-semibold text-text">
          {isRTL ? 'عن قدامك' : 'About Odamak'}
        </h2>
        <p className="text-[16px] leading-[2] text-muted">
          {isRTL
            ? 'قدامك منصة عربية لمتابعة أسعار الذهب والعملات والفضة والعملات الرقمية في مصر. ننظم البيانات المتاحة ونقدم أدوات حسابية ورسومًا تساعدك على قراءة السوق بصورة أوضح.'
            : 'Odamak is an Arabic platform for following gold, currency, silver, and cryptocurrency prices in Egypt, with clear market data and practical calculation tools.'}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map(({ icon: Icon, ar, en }) => {
          const content = isRTL ? ar : en;
          return (
            <div key={content.title}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-on-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-[16px] font-semibold text-text">{content.title}</h3>
              </div>
              <p className="text-[15px] leading-[1.9] text-muted">{content.body}</p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line pt-6 text-center">
        <p className="mb-2 text-[15px] text-muted">
          {isRTL ? 'هل لديك أسئلة أو اقتراحات؟' : 'Have questions or suggestions?'}
        </p>
        <a href="/contact" className="text-gold underline-offset-4 hover:underline">
          {isRTL ? 'تواصل معنا' : 'Contact us'}
        </a>
      </div>
    </ArticleLayout>
  );
}
