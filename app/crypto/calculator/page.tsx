import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import CryptoCalculatorPage from './calculator-client';

export const metadata: Metadata = buildMetadata('cryptoCalculator', {
  canonicalPath: '/crypto/calculator',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة العملات الرقمية - Mersadna',
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
      <CryptoCalculatorPage />
    </>
  );
}
