import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { HeroStatsBannerServer, HeroStatsBannerSkeleton } from "@/components/home/hero-stats-banner-server";
import { Suspense } from "react";
import { SEO_CONFIG } from "@/lib/seo-config";

// The API container starts after the frontend image is built. Avoid caching
// build-time fetch failures into pages that render live market widgets.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Mersadna - مرصادنا | أسعار الذهب الحية في مصر",
    template: "%s | Mersadna"
  },
  description: "تابع أسعار الذهب الحية في مصر بالجنيه المصري لجميع العيارات (24، 21، 18، 14) مع حاسبة الزكاة، حاسبة الذهب، وتحليلات السوق المجانية.",
  keywords: ["أسعار الذهب", "ذهب في مصر", "اسعار الذهب اليوم", "ذهب عيار 24", "ذهب عيار 21", "ذهب عيار 18", "زكاة الذهب", "حاسبة الذهب", "سعر الذهب", "Egypt gold prices", "gold price Egypt"],
  authors: [{ name: "Mersadna" }],
  creator: "Mersadna",
  publisher: "Mersadna",
  manifest: "/manifest.json",
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
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: "https://nezzel.com",
    siteName: "Mersadna",
    title: "Mersadna - مرصادنا | أسعار الذهب الحية في مصر",
    description: "تابع أسعار الذهب الحية في مصر بالجنيه المصري لجميع العيارات مع حاسبة الزكاة وتحليلات السوق المجانية",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mersadna - أسعار الذهب في مصر"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mersadna - مرصادنا | أسعار الذهب الحية في مصر",
    description: "تابع أسعار الذهب الحية في مصر بالجنيه المصري لجميع العيارات مع حاسبة الزكاة وتحليلات السوق المجانية",
    images: ["/og-image.png"],
    creator: "@nezzelgold"
  },
  icons: {
    icon: [
      { url: "/app-icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  },
  verification: {
    ...(SEO_CONFIG.verification.google ? { google: SEO_CONFIG.verification.google } : {}),
    ...(SEO_CONFIG.verification.yandex ? { yandex: SEO_CONFIG.verification.yandex } : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mersadna',
  alternateName: 'مرصادنا',
  url: 'https://nezzel.com',
  description: 'تابع أسعار الذهب الحية في مصر بالجنيه المصري لجميع العيارات مع حاسبة الزكاة وتحليلات السوق المجانية',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EGP',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1000'
  },
  inLanguage: ['ar', 'en'],
  keywords: 'أسعار الذهب, ذهب في مصر, اسعار الذهب اليوم, ذهب عيار 24, ذهب عيار 21, ذهب عيار 18, زكاة الذهب, حاسبة الذهب, سعر الذهب'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cairo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
