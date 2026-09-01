import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo-config';
import { KARATS } from '@/lib/constants';
import { KaratCode } from '@/types';
import KaratPage from './karat-client';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ karat: KaratCode }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { karat } = await params;
  const karatInfo = KARATS.find((k) => k.code === karat);
  const domain = SEO_CONFIG.site.domain;

  if (!karatInfo) {
    return { title: 'الصفحة غير موجودة', robots: { index: false, follow: false } };
  }

  const title = `سعر الذهب ${karatInfo.name} اليوم في مصر`;
  const description = `تابع سعر الذهب ${karatInfo.name} اليوم في مصر بالجنيه المصري، مع درجة النقاء وحركة السعر الأخيرة.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${domain}/karat/${karat}`,
    },
    openGraph: {
      title: `${title} | ${SEO_CONFIG.site.name}`,
      description,
      url: `${domain}/karat/${karat}`,
      type: 'website',
      locale: 'ar_EG',
      siteName: SEO_CONFIG.site.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SEO_CONFIG.site.name}`,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { karat } = await params;
  const karatInfo = KARATS.find((item) => item.code === karat);
  if (!karatInfo) notFound();
  return (
    <>
      <header className="mb-6 rounded-2xl border border-border/70 bg-card p-5 md:p-7">
        <p className="mb-2 text-sm font-semibold text-primary">سعر الذهب في مصر</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">سعر الذهب {karatInfo.name} اليوم في مصر</h1>
        <p className="mt-3 leading-7 text-muted-foreground">تابع السعر المرجعي للجرام، نسبة النقاء، وحركة السعر خلال الفترة الأخيرة.</p>
      </header>
      <KaratPage params={params} />
    </>
  );
}
