import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo-config';
import { KARATS } from '@/lib/constants';
import { KaratCode } from '@/types';
import KaratPage from './karat-client';

interface Props {
  params: Promise<{ karat: KaratCode }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { karat } = await params;
  const karatInfo = KARATS.find((k) => k.code === karat);
  const domain = SEO_CONFIG.site.domain;
  const template = SEO_CONFIG.pages.karatTemplate;

  if (!karatInfo) {
    return { title: 'عيار غير موجود' };
  }

  const title = template.title.replace(/%s/g, karatInfo.name);
  const description = template.description.replace(/%s/g, karatInfo.name);
  const keywords = template.keywords.map((k) => k.replace(/%s/g, karatInfo.name));

  return {
    title,
    description,
    keywords,
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
      creator: SEO_CONFIG.site.twitter,
    },
  };
}

export default function Page({ params }: Props) {
  return <KaratPage params={params} />;
}
