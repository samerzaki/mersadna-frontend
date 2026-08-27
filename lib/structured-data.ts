import { SEO_CONFIG } from './seo-config';

const domain = SEO_CONFIG.site.domain;

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${domain}${item.url}`,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    ...(article.image ? { image: article.image } : {}),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.author || SEO_CONFIG.site.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.site.name,
      ...(SEO_CONFIG.images.og
        ? {
            logo: {
              '@type': 'ImageObject',
              url: `${domain}/icon-512x512.png`,
            },
          }
        : {}),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${domain}${article.url}`,
    },
    inLanguage: 'ar',
  };
}

export function generateSoftwareAppSchema(app: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: 'FinanceApplication',
    description: app.description,
    url: app.url.startsWith('http') ? app.url : `${domain}${app.url}`,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EGP',
    },
    inLanguage: 'ar',
  };
}
