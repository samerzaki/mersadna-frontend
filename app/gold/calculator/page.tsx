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
      <GoldCalculatorPage />
    </>
  );
}
