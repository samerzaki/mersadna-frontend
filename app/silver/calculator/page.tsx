import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import SilverCalculatorPage from './calculator-client';

export const metadata: Metadata = buildMetadata('silverCalculator', {
  canonicalPath: '/silver/calculator',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة الفضة - Mersadna',
  description: 'احسب قيمة الفضة بالجنيه المصري مع المصنعية',
  url: '/silver/calculator',
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SilverCalculatorPage />
    </>
  );
}
