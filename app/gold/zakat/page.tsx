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
      <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">حاسبة زكاة الذهب</h1>
        <p className="mt-3 leading-7 text-muted-foreground">هذه الأداة تقدير مساعد؛ راجع الجهة الشرعية المختصة في الحالات الخاصة.</p>
      </header>
      <GoldZakatPage />
    </>
  );
}
