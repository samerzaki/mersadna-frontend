import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import GoldCalculatorPage from './calculator-client';

export const metadata: Metadata = buildMetadata('goldCalculator', {
  canonicalPath: '/gold/calculator',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة الذهب - Odamak',
  description: 'احسب قيمة الذهب بالجنيه المصري لجميع العيارات مع المصنعية والضريبة',
  url: '/gold/calculator',
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">حاسبة الذهب في مصر</h1>
        <p className="mt-3 leading-7 text-muted-foreground">أدخل الوزن والعيار والمصنعية للحصول على قيمة تقديرية مبنية على السعر المرجعي المعروض.</p>
      </header>
      <GoldCalculatorPage />
    </>
  );
}
