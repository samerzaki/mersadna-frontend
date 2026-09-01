import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Cairo } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';
import { Header } from '@/components/layout/header';
import { HeroStatsBannerServer, HeroStatsBannerSkeleton } from '@/components/home/hero-stats-banner-server';
import { absoluteUrl, SEO_CONFIG, SITE_URL } from '@/lib/seo-config';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_CONFIG.pages.home.title,
    template: '%s | مرصادنا',
  },
  description: SEO_CONFIG.site.description,
  applicationName: SEO_CONFIG.site.nameAr,
  authors: [{ name: SEO_CONFIG.site.nameAr }],
  creator: SEO_CONFIG.site.nameAr,
  publisher: SEO_CONFIG.site.nameAr,
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: SITE_URL,
    siteName: SEO_CONFIG.site.nameAr,
    title: SEO_CONFIG.pages.home.title,
    description: SEO_CONFIG.pages.home.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SEO_CONFIG.site.nameAr }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.pages.home.title,
    description: SEO_CONFIG.pages.home.description,
    images: ['/opengraph-image'],
  },
  icons: { icon: [{ url: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
  verification: {
    ...(SEO_CONFIG.verification.google ? { google: SEO_CONFIG.verification.google } : {}),
    ...(SEO_CONFIG.verification.bing ? { other: { 'msvalidate.01': SEO_CONFIG.verification.bing } } : {}),
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SEO_CONFIG.site.nameAr,
      alternateName: SEO_CONFIG.site.name,
      url: SITE_URL,
      logo: absoluteUrl('/app-icon.svg'),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SEO_CONFIG.site.nameAr,
      url: SITE_URL,
      inLanguage: 'ar-EG',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cairo.variable}>
      <body
        suppressHydrationWarning
        className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <Providers>
          <div className="relative flex min-h-screen flex-col pt-16">
            <Header />
            <AppShell
              statsBanner={
                <Suspense fallback={<HeroStatsBannerSkeleton />}>
                  <HeroStatsBannerServer />
                </Suspense>
              }
            >
              {children}
            </AppShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
