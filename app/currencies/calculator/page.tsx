import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import CalculatorPage from './calculator-client';

export const metadata: Metadata = buildMetadata('currenciesCalculator', {
  canonicalPath: '/currencies/calculator',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة العملات - nezzel gold',
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
      <CalculatorPage />
    </>
  );
}
