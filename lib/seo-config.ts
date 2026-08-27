import type { Metadata } from 'next';

// ============================================================
// SEO Configuration - Centralized SEO data for all pages
// ============================================================
// INSTRUCTIONS: Fill in the empty strings below with your data.
// All page titles, descriptions, and keywords can be customized.
// ============================================================

export const SEO_CONFIG = {
  // --- Site-wide settings ---
  site: {
    name: 'nezzel gold',
    nameAr: 'نِزِل ذهب',
    domain: 'https://nezzel.com',
    twitter: '@nezzelgold',
  },

  // --- USER: Fill these verification codes ---
  verification: {
    google: '',   // Google Search Console verification code
    yandex: '',   // Yandex Webmaster verification code
    bing: '',     // Bing Webmaster verification code
  },

  // --- USER: Fill your social media links ---
  social: {
    twitter: '',     // e.g. https://twitter.com/nezzelgold
    facebook: '',    // e.g. https://facebook.com/nezzelgold
    instagram: '',   // e.g. https://instagram.com/nezzelgold
    youtube: '',     // e.g. https://youtube.com/@nezzelgold
    tiktok: '',      // e.g. https://tiktok.com/@nezzelgold
  },

  // --- Page metadata ---
  // USER: Review and customize these descriptions and keywords
  pages: {
    // Gold section
    goldCalculator: {
      title: 'حاسبة الذهب',
      description: 'احسب قيمة الذهب بالجنيه المصري لجميع العيارات مع المصنعية والضريبة. حاسبة ذهب ذكية ومجانية.',
      keywords: ['حاسبة الذهب', 'حساب سعر الذهب', 'المصنعية', 'قيمة الذهب', 'gold calculator Egypt'],
    },
    goldZakat: {
      title: 'حاسبة زكاة الذهب',
      description: 'احسب زكاة الذهب الواجبة عليك بسهولة وفقاً للشريعة الإسلامية. حاسبة النصاب والزكاة لجميع العيارات.',
      keywords: ['زكاة الذهب', 'حاسبة الزكاة', 'نصاب الذهب', 'زكاة المال', 'gold zakat calculator'],
    },

    // Silver section
    silver: {
      title: 'أسعار الفضة',
      description: 'تابع أسعار الفضة الحية في مصر بالجنيه المصري مع الرسوم البيانية وتحليلات الأسعار.',
      keywords: ['أسعار الفضة', 'سعر الفضة اليوم', 'فضة في مصر', 'silver price Egypt'],
    },
    silverCalculator: {
      title: 'حاسبة الفضة',
      description: 'احسب قيمة الفضة بالجنيه المصري مع المصنعية. حاسبة فضة ذكية ومجانية.',
      keywords: ['حاسبة الفضة', 'حساب سعر الفضة', 'silver calculator'],
    },

    // Currency section
    currenciesCalculator: {
      title: 'حاسبة العملات',
      description: 'حول بين العملات المختلفة بأسعار البنوك والسوق الموازي في مصر. محول عملات فوري ودقيق.',
      keywords: ['حاسبة العملات', 'تحويل العملات', 'محول العملات', 'currency converter Egypt'],
    },
    currencyAnalytics: {
      title: 'تحليلات العملات',
      description: 'تحليلات شاملة لأسعار العملات الأجنبية في مصر مع مقارنة البنوك والسوق الموازي.',
      keywords: ['تحليلات العملات', 'تحليل سعر الدولار', 'مقارنة أسعار البنوك', 'currency analytics Egypt'],
    },

    // Crypto section
    cryptoCalculator: {
      title: 'حاسبة العملات الرقمية',
      description: 'احسب قيمة العملات الرقمية مثل البيتكوين والإيثيريوم بالجنيه المصري.',
      keywords: ['حاسبة البيتكوين', 'حاسبة العملات الرقمية', 'crypto calculator', 'bitcoin calculator'],
    },

    // Charts & History
    chart: {
      title: 'الرسوم البيانية',
      description: 'رسوم بيانية تفاعلية لأسعار الذهب والعملات في مصر مع تحليلات الاتجاهات.',
      keywords: ['رسوم بيانية', 'charts', 'تحليل أسعار الذهب', 'gold charts Egypt'],
    },
    history: {
      title: 'السجل السعري',
      description: 'تابع تاريخ أسعار الذهب والعملات في مصر مع المقارنة بين الفترات الزمنية.',
      keywords: ['تاريخ أسعار الذهب', 'السجل السعري', 'gold price history Egypt'],
    },

    // News
    news: {
      title: 'آخر الأخبار',
      description: 'تابع آخر أخبار الذهب والعملات والاقتصاد في مصر والعالم.',
      keywords: ['أخبار الذهب', 'أخبار العملات', 'أخبار الاقتصاد', 'gold news Egypt'],
    },

    // Static pages
    about: {
      title: 'من نحن',
      description: 'تعرف على منصة nezzel gold - وجهتك الموثوقة لمتابعة أسعار الذهب والعملات في مصر.',
      keywords: ['nezzel gold', 'نزل ذهب', 'من نحن', 'about nezzel gold'],
    },
    contact: {
      title: 'اتصل بنا',
      description: 'تواصل مع فريق nezzel gold. نسعد بالإجابة على استفساراتك ومقترحاتك.',
      keywords: ['اتصل بنا', 'تواصل معنا', 'contact nezzel gold'],
    },
    pricing: {
      title: 'الأسعار والباقات',
      description: 'اختر الباقة المناسبة لك من خطط nezzel gold للوصول إلى جميع المزايا.',
      keywords: ['أسعار الاشتراك', 'باقات', 'pricing', 'nezzel gold plans'],
    },
    privacy: {
      title: 'سياسة الخصوصية',
      description: 'سياسة الخصوصية وحماية البيانات الشخصية في منصة nezzel gold.',
      keywords: ['سياسة الخصوصية', 'حماية البيانات', 'privacy policy'],
    },
    terms: {
      title: 'شروط الاستخدام',
      description: 'شروط وأحكام استخدام منصة nezzel gold لمتابعة أسعار الذهب والعملات.',
      keywords: ['شروط الاستخدام', 'الأحكام', 'terms of service'],
    },

    // User dashboard (noindex)
    meAlerts: {
      title: 'التنبيهات',
      description: 'إدارة تنبيهات الأسعار الخاصة بك.',
    },
    mePortfolio: {
      title: 'المحفظة',
      description: 'تتبع محفظتك الاستثمارية.',
    },
    meWatchlist: {
      title: 'قائمة المتابعة',
      description: 'إدارة قائمة المتابعة الخاصة بك.',
    },
    meSettings: {
      title: 'الإعدادات',
      description: 'إعدادات حسابك.',
    },
    meSavedNews: {
      title: 'الأخبار المحفوظة',
      description: 'الأخبار التي قمت بحفظها.',
    },

    // Auth pages (noindex)
    authLogin: {
      title: 'تسجيل الدخول',
      description: 'سجل دخولك إلى حسابك في nezzel gold.',
    },
    authRegister: {
      title: 'إنشاء حساب',
      description: 'أنشئ حسابك المجاني في nezzel gold.',
    },
    authForgotPassword: {
      title: 'نسيت كلمة المرور',
      description: 'استعادة كلمة المرور الخاصة بحسابك.',
    },
    authResetPassword: {
      title: 'إعادة تعيين كلمة المرور',
      description: 'إعادة تعيين كلمة المرور الخاصة بحسابك.',
    },
    authVerifyOtp: {
      title: 'التحقق من الرمز',
      description: 'التحقق من رمز التأكيد المرسل إليك.',
    },

    // Dynamic pages - templates
    karatTemplate: {
      // %s will be replaced with karat name e.g. "عيار 24"
      title: 'سعر الذهب %s في مصر',
      description: 'تابع سعر الذهب %s الحي في مصر بالجنيه المصري مع الرسوم البيانية وتحليلات السوق.',
      keywords: ['سعر ذهب %s', 'ذهب %s اليوم', 'gold %s price Egypt'],
    },
  },

  // OG image defaults
  images: {
    og: '/og-image.png',
    ogWidth: 1200,
    ogHeight: 630,
  },
} as const;

// ============================================================
// Helper: Build metadata for a page from SEO_CONFIG
// ============================================================
type PageKey = keyof typeof SEO_CONFIG.pages;

interface BuildMetadataOptions {
  noindex?: boolean;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  overrides?: Partial<Metadata>;
}

export function buildMetadata(
  pageKey: PageKey,
  options: BuildMetadataOptions = {}
): Metadata {
  const page = SEO_CONFIG.pages[pageKey];
  const { noindex = false, canonicalPath, ogType = 'website', overrides = {} } = options;
  const domain = SEO_CONFIG.site.domain;

  const metadata: Metadata = {
    title: page.title,
    description: page.description,
    ...('keywords' in page && page.keywords ? { keywords: [...page.keywords] } : {}),
    ...(noindex
      ? { robots: { index: false, follow: false } }
      : {}),
    ...(canonicalPath
      ? { alternates: { canonical: `${domain}${canonicalPath}` } }
      : {}),
    openGraph: {
      title: `${page.title} | ${SEO_CONFIG.site.name}`,
      description: page.description,
      type: ogType,
      locale: 'ar_EG',
      siteName: SEO_CONFIG.site.name,
      ...(canonicalPath ? { url: `${domain}${canonicalPath}` } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${SEO_CONFIG.site.name}`,
      description: page.description,
      creator: SEO_CONFIG.site.twitter,
    },
    ...overrides,
  };

  return metadata;
}
