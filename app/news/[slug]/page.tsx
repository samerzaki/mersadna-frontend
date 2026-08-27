import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo-config';
import { API_BASE_URL } from '@/lib/constants';
import NewsDetailPage from './news-detail-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const domain = SEO_CONFIG.site.domain;

  try {
    const res = await fetch(`${API_BASE_URL}/news/articles/${slug}`, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'ar',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error('Not found');

    const data = await res.json();
    const news = data.data?.news;

    if (!news) throw new Error('No news data');

    const title = news.titleAr || news.title;
    const description = news.excerptAr || news.excerpt || (news.contentAr || news.content || '').substring(0, 160);

    return {
      title,
      description,
      keywords: news.tags || [],
      alternates: {
        canonical: `${domain}/news/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${domain}/news/${slug}`,
        type: 'article',
        locale: 'ar_EG',
        siteName: SEO_CONFIG.site.name,
        publishedTime: news.publishedAt,
        ...(news.updatedAt ? { modifiedTime: news.updatedAt } : {}),
        ...(news.thumbnail
          ? {
              images: [
                {
                  url: news.thumbnail,
                  width: 1200,
                  height: 630,
                  alt: news.thumbnailAlt || title,
                },
              ],
            }
          : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: SEO_CONFIG.site.twitter,
        ...(news.thumbnail ? { images: [news.thumbnail] } : {}),
      },
    };
  } catch {
    return {
      title: SEO_CONFIG.pages.news.title,
      description: SEO_CONFIG.pages.news.description,
    };
  }
}

export default function Page() {
  return <NewsDetailPage />;
}
