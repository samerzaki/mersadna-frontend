import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import CalculatorPage from './calculator-client';

export const metadata: Metadata = buildMetadata('currenciesCalculator', {
  canonicalPath: '/currencies/calculator',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة العملات - Mersadna',
  description: 'حول بين العملات المختلفة بأسعار البنوك والسوق الموازي في مصر',
  url: '/currencies/calculator',
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">حاسبة تحويل العملات</h1>
        <p className="mt-3 leading-7 text-muted-foreground">استخدم الأسعار المرجعية للحساب والمقارنة، وتحقق من السعر النهائي لدى الجهة المنفذة.</p>
      </header>
      <CalculatorPage />
    </>
  );
}
