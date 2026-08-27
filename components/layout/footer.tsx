'use client';

import Link from 'next/link';
import {
  Coins,
  Building2,
  ShoppingCart,
  ListChecks,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface EcosystemItem {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  status: 'current' | 'soon';
  iconBg: string;
}

const ecosystemItems: EcosystemItem[] = [
  {
    name: 'Nezzel Gold',
    nameAr: 'نِزِل دهب',
    description: 'Gold & currency tracking',
    descriptionAr: 'تتبع أسعار الذهب والعملات',
    icon: Coins,
    href: '/',
    status: 'current',
    iconBg: 'bg-orange-500',
  },
  {
    name: 'Nezzel',
    nameAr: 'نِزِل',
    description: 'Best e-commerce prices',
    descriptionAr: 'أرخص أسعار متاجر إلكترونية',
    icon: ShoppingCart,
    href: '#',
    status: 'soon',
    iconBg: 'bg-primary-500',
  },
  {
    name: 'Nezzel Todo',
    nameAr: 'نِزِل تودو',
    description: 'Home shopping lists',
    descriptionAr: 'متخصص لشراء الطلبات المنِزِلية',
    icon: ListChecks,
    href: '#',
    status: 'soon',
    iconBg: 'bg-green-500',
  },
  {
    name: 'Nezzel Estate',
    nameAr: 'نِزِل عقار',
    description: 'Real estate opportunities',
    descriptionAr: 'فرص العقارات المتاحة للشراء',
    icon: Building2,
    href: '#',
    status: 'soon',
    iconBg: 'bg-red-500',
  },
];

const footerLinks = {
  products: {
    title: 'Products',
    titleAr: 'المنتجات',
    links: [
      { label: 'Gold Prices', labelAr: 'أسعار الذهب', href: '/gold' },
      { label: 'Currencies', labelAr: 'العملات', href: '/currencies' },
      { label: 'Crypto', labelAr: 'العملات الرقمية', href: '/crypto' },
      { label: 'Charts', labelAr: 'الرسوم البيانية', href: '/chart' },
    ],
  },
  tools: {
    title: 'Tools',
    titleAr: 'الأدوات',
    links: [
      { label: 'Calculator', labelAr: 'الحاسبة', href: '/gold/calculator' },
      { label: 'Zakat', labelAr: 'الزكاة', href: '/gold/zakat' },
      { label: 'Converter', labelAr: 'المحول', href: '/currencies/calculator' },
      { label: 'Alerts', labelAr: 'التنبيهات', href: '/me/alerts' },
    ],
  },
  company: {
    title: 'Company',
    titleAr: 'الشركة',
    links: [
      { label: 'About', labelAr: 'من نحن', href: '/about' },
      { label: 'Contact', labelAr: 'اتصل بنا', href: '/contact' },
      { label: 'Privacy', labelAr: 'الخصوصية', href: '/privacy' },
      { label: 'Terms', labelAr: 'الشروط', href: '/terms' },
    ],
  },
  support: {
    title: 'Support',
    titleAr: 'الدعم',
    links: [
      { label: 'Help', labelAr: 'المساعدة', href: '/help' },
      { label: 'Docs', labelAr: 'الوثائق', href: '/docs' },
      { label: 'FAQ', labelAr: 'الأسئلة', href: '/faq' },
      { label: 'Status', labelAr: 'الحالة', href: '/status' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/nezzelgold', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/nezzelgold', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/nezzelgold', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/nezzel', label: 'LinkedIn' },
];

export function Footer() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <footer className="w-full border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Footer Links */}
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-3 text-sm font-semibold">
                {isRTL ? section.titleAr : section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {isRTL ? link.labelAr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download App */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">
              {isRTL ? 'حمّل التطبيق' : 'Download App'}
            </h3>
            <div className="flex flex-col items-start gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>App Store</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <span>Google Play</span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-10 rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {isRTL ? (
                <>
                  الأسعار المعروضة للإشارة فقط ويتم تحديثها دورياً. قد تختلف الأسعار
                  الفعلية. نِزِل ذهب ليس مسؤولاً عن قرارات التداول. يرجى استشارة مستشار مالي
                  قبل اتخاذ قرارات استثمارية.
                </>
              ) : (
                <>
                  Prices shown are for reference only and updated periodically. Actual prices
                  may vary. Nezzel Gold is not responsible for trading decisions. Please
                  consult a financial advisor before making investment decisions.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Nezzel Ecosystem */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-lg font-semibold">
            {isRTL ? 'منظومة نِزِل' : 'Nezzel Ecosystem'}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecosystemItems.map((item) => {
              const Icon = item.icon;
              const isSoon = item.status === 'soon';

              return (
                <Link
                  key={item.name}
                  href={isSoon ? '#' : item.href}
                  className={cn(
                    'group relative overflow-hidden rounded-lg border bg-card p-4 transition-all',
                    'hover:border-primary/50 hover:shadow-md',
                    isSoon && 'cursor-not-allowed opacity-60'
                  )}
                  onClick={(e) => isSoon && e.preventDefault()}
                >
                  {/* Status Badge */}
                  {isSoon && (
                    <div className="absolute end-3 top-3 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {isRTL ? 'قريباً' : 'Soon'}
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
                        item.iconBg,
                        'transition-transform group-hover:scale-110'
                      )}
                    >
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm">
                        {isRTL ? item.nameAr : item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? item.descriptionAr : item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span>
              © {new Date().getFullYear()} {isRTL ? 'نِزِل ذهب' : 'Nezzel Gold'}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social) => {
              const SocialIcon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label={social.label}
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          {/* Contact */}
          <a
            href="mailto:info@nezzel.com"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            <span>info@nezzel.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
