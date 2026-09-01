import type { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { absoluteUrl } from '@/lib/seo-config';
import { newsDetailPath } from '@/lib/news-routes';

const staticLastModified = new Date('2026-09-01T00:00:00.000Z');
const publicPaths = [
  '/', '/gold', '/gold/calculator', '/gold/zakat', '/silver', '/silver/calculator',
  '/currencies', '/currencies/calculator', '/currency/analytics', '/crypto',
  '/crypto/calculator', '/history', '/news', '/about', '/contact',
  '/privacy', '/terms', '/disclaimer', '/karat/k24', '/karat/k21', '/karat/k18',
];

type SitemapArticle = { id?: number; slug?: string; title?: string; updatedAt?: string; updated_at?: string; publishedAt?: string; published_at?: string };

async function getNewsEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 1;

  try {
    while (page <= 100) {
      const response = await fetch(`${API_BASE_URL}/news?page=${page}`, {
        headers: { Accept: 'application/json', 'Accept-Language': 'ar' },
        next: { revalidate: 300 },
      });
      if (!response.ok) break;

      const payload = await response.json() as { data?: SitemapArticle[]; pagination?: { totalPages?: number } };
      const articles = Array.isArray(payload.data) ? payload.data : [];
      entries.push(...articles.filter((article) => article.id).map((article) => ({
        url: absoluteUrl(newsDetailPath(article.id!, article.slug, article.title)),
        lastModified: new Date(article.updatedAt || article.updated_at || article.publishedAt || article.published_at || staticLastModified),
      })));

      const lastPage = payload.pagination?.totalPages ?? 1;
      if (page >= lastPage || articles.length === 0) break;
      page += 1;
    }
  } catch {
    // A temporary API failure must not remove the core sitemap URLs.
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = publicPaths.map((path) => ({ url: absoluteUrl(path), lastModified: staticLastModified }));
  return [...staticEntries, ...(await getNewsEntries())];
}
