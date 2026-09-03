'use client';

import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ArticleLayout } from '@/components/ui/article-layout';

export default function DisclaimerPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <ArticleLayout
      title={isRTL ? 'إخلاء المسؤولية' : 'Disclaimer'}
      actions={
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-on-gold">
          <AlertTriangle className="h-5 w-5" />
        </div>
      }
    >
      <div className="space-y-5 text-[16px] leading-[2] text-muted" dir={isRTL ? 'rtl' : 'ltr'}>
        {isRTL ? <ArabicContent /> : <EnglishContent />}
      </div>
    </ArticleLayout>
  );
}

function ArabicContent() {
  return <>
    <p>يعمل <strong className="text-text">قدامك</strong> كمنصة مستقلة لرصد وتجميع وعرض الأسعار والبيانات والمعلومات المتاحة في الأسواق بما يشمل أسعار <strong className="text-text">الذهب والفضة والمعادن والعملات وأسعار البنوك والعملات الرقمية وغيرها من الأصول والمؤشرات</strong> التي يتابعها الموقع.</p>
    <p><strong className="text-text">قدامك ليس جهة تسعير ولا بنكا ولا بورصة ولا وسيطا ماليا ولا جهة لبيع أو شراء أي من الأصول المعروضة.</strong> الأسعار المنشورة على الموقع هي أسعار يتم رصدها وتجميعها من السوق ومصادر وبيانات متعددة ويتم عرضها لأغراض معلوماتية واسترشادية فقط.</p>
    <p>قد تختلف الأسعار المعروضة على قدامك عن <strong className="text-text">السعر الفعلي للشراء أو البيع أو التنفيذ</strong> لدى البنوك أو الصاغة أو التجار أو البورصات أو منصات التداول أو غيرها من الجهات كما قد تتغير الأسعار بشكل سريع أو يحدث تأخير أو خطأ في تحديث بعض البيانات.</p>
    <p>لذلك <strong className="text-text">لا يضمن قدامك دقة أو اكتمال أو تحديث الأسعار والبيانات في جميع الأوقات ولا ينبغي الاعتماد عليها وحدها عند تنفيذ أي معاملة أو اتخاذ أي قرار مالي أو استثماري.</strong> وينصح دائما بالتحقق من السعر النهائي مباشرة لدى الجهة التي سيتم التعامل معها.</p>
    <p>كما أن الأخبار والمعلومات والتحليلات والمحتوى المنشور على الموقع مقدمة لأغراض معلوماتية فقط ولا تمثل نصيحة أو توصية مالية أو استثمارية أو دعوة للشراء أو البيع أو التداول.</p>
    <p>لا يشجع قدامك على إجراء أي معاملات تخالف القوانين أو اللوائح المعمول بها ولا يتحمل الموقع أو القائمون عليه مسؤولية أي خسائر أو أضرار أو قرارات تنتج بصورة مباشرة أو غير مباشرة عن استخدام أو الاعتماد على الأسعار أو البيانات أو المعلومات المنشورة على الموقع.</p>
    <p><strong className="text-text">استخدامك لقدامك يعني إدراكك أن الموقع أداة لرصد ومتابعة السوق وليس مصدرا ملزما للتسعير أو جهة لتنفيذ المعاملات وأن أي قرار أو معاملة تتم على مسؤوليتك الخاصة.</strong></p>
  </>;
}

function EnglishContent() {
  return <>
    <p><strong className="text-text">Odamak</strong> operates as an independent platform for monitoring, aggregating, and displaying prices, data, and information available in the markets, including prices for <strong className="text-text">gold, silver, metals, currencies, bank rates, digital currencies, and other assets and indices</strong> followed by the website.</p>
    <p><strong className="text-text">Odamak is not a pricing authority, bank, exchange, financial intermediary, or a party that sells or purchases any of the displayed assets.</strong> The prices published on the website are monitored and aggregated from the market and multiple sources and data sets, and are displayed for informational and guidance purposes only.</p>
    <p>The prices displayed on Odamak may differ from the <strong className="text-text">actual purchase, sale, or execution price</strong> offered by banks, goldsmiths, merchants, exchanges, trading platforms, or other parties. Prices may also change quickly, and some data may be delayed or updated incorrectly.</p>
    <p>Accordingly, <strong className="text-text">Odamak does not guarantee the accuracy, completeness, or timeliness of prices and data at all times, and they should not be relied upon alone when carrying out any transaction or making any financial or investment decision.</strong> You are always advised to verify the final price directly with the party with whom you intend to transact.</p>
    <p>News, information, analyses, and content published on the website are provided for informational purposes only and do not constitute financial or investment advice, a recommendation, or an invitation to buy, sell, or trade.</p>
    <p>Odamak does not encourage transactions that violate applicable laws or regulations. The website and its operators shall not be liable for any losses, damages, or decisions resulting directly or indirectly from using or relying on the prices, data, or information published on the website.</p>
    <p><strong className="text-text">Your use of Odamak means that you understand that the website is a tool for monitoring and following the market, not a binding pricing source or a party for executing transactions, and that any decision or transaction is made at your own responsibility.</strong></p>
  </>;
}
