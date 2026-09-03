import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo-config';
import { generateSoftwareAppSchema } from '@/lib/structured-data';
import GoldZakatPage from './zakat-client';

export const metadata: Metadata = buildMetadata('goldZakat', {
  canonicalPath: '/gold/zakat',
});

const jsonLd = generateSoftwareAppSchema({
  name: 'حاسبة زكاة الذهب - Odamak',
  description: 'احسب زكاة الذهب الواجبة عليك بسهولة وفقاً للشريعة الإسلامية',
  url: '/gold/zakat',
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GoldZakatPage />
    </>
  );
}
