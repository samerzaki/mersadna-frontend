import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import CryptoCalculatorPage from './calculator-client';

export const metadata: Metadata = buildMetadata('cryptoCalculator', {
  canonicalPath: '/crypto/calculator',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة العملات الرقمية - Odamak',
  description: 'احسب قيمة العملات الرقمية مثل البيتكوين والإيثيريوم بالجنيه المصري',
  url: '/crypto/calculator',
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">حاسبة العملات الرقمية</h1>
        <p className="mt-3 leading-7 text-muted-foreground">احسب قيمة العملات الرقمية بصورة مرجعية، مع الانتباه إلى سرعة تغير الأسعار.</p>
      </header>
      <CryptoCalculatorPage />
    </>
  );
}
