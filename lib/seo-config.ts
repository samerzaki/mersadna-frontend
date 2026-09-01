import type { Metadata } from 'next';

export const SITE_URL = (process.env.SITE_URL || 'https://mersadna.com').replace(/\/$/, '');

export const SEO_CONFIG = {
  site: {
    name: 'Mersadna',
    nameAr: 'مرصادنا',
    domain: SITE_URL,
    description: 'مرصادنا منصة عربية لمتابعة أسعار الذهب والعملات والمعادن في مصر.',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.BING_SITE_VERIFICATION || '',
  },
  social: {
    x: process.env.NEXT_PUBLIC_X_URL || '',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  },
  pages: {
    home: { title: 'مرصادنا | أسعار الذهب والعملات في مصر', description: 'تابع أسعار الذهب والعملات والفضة في مصر، مع تحديثات السوق وأدوات حسابية واضحة.' },
    gold: { title: 'أسعار الذهب اليوم في مصر', description: 'أسعار الذهب اليوم في مصر لعيارات 24 و21 و18 بالجنيه المصري، مع آخر تحديث والرسم البياني وحاسبة الذهب.' },
    goldCalculator: { title: 'حاسبة الذهب في مصر', description: 'احسب القيمة التقديرية للذهب بالجنيه المصري حسب العيار والوزن والمصنعية.' },
    goldZakat: { title: 'حاسبة زكاة الذهب', description: 'احسب زكاة الذهب بصورة تقديرية حسب الوزن والعيار وقيمة النصاب.' },
    silver: { title: 'أسعار الفضة اليوم في مصر', description: 'تابع أسعار الفضة في مصر وآخر تحديثات السوق مع أدوات الحساب.' },
    silverCalculator: { title: 'حاسبة الفضة', description: 'احسب القيمة التقديرية للفضة بالجنيه المصري حسب الوزن والنقاء.' },
    currencies: { title: 'أسعار العملات اليوم في مصر', description: 'تابع أسعار الدولار واليورو والعملات الأجنبية في البنوك المصرية والسوق الموازية.' },
    currenciesCalculator: { title: 'حاسبة تحويل العملات', description: 'حوّل بين العملات بأسعار مرجعية محدثة في مصر.' },
    currencyAnalytics: { title: 'تحليلات أسعار العملات في مصر', description: 'قارن حركة أسعار العملات وبيانات البنوك المصرية في مكان واحد.' },
    crypto: { title: 'أسعار العملات الرقمية', description: 'تابع أسعار العملات الرقمية وبيانات السوق الرئيسية.' },
    cryptoCalculator: { title: 'حاسبة العملات الرقمية', description: 'احسب القيمة التقديرية للعملات الرقمية بالدولار والجنيه المصري.' },
    chart: { title: 'الرسم البياني لأسعار الذهب', description: 'استكشف الرسم البياني لحركة أسعار الذهب في مصر عبر الفترات الزمنية المختلفة.' },
    history: { title: 'تاريخ أسعار الذهب في مصر', description: 'راجع السجل السعري للذهب في مصر وقارن تغير الأسعار بمرور الوقت.' },
    news: { title: 'أخبار الذهب والاقتصاد', description: 'أحدث أخبار الذهب والعملات والاقتصاد التي يكتبها فريق مرصادنا.' },
    about: { title: 'عن مرصادنا', description: 'تعرف على منصة مرصادنا لمتابعة الأسواق المصرية.' },
    contact: { title: 'اتصل بمرصادنا', description: 'تواصل مع فريق مرصادنا للاستفسارات والمقترحات.' },
    privacy: { title: 'سياسة الخصوصية', description: 'سياسة خصوصية منصة مرصادنا.' },
    terms: { title: 'شروط الاستخدام', description: 'شروط استخدام منصة مرصادنا.' },
    meAlerts: { title: 'التنبيهات', description: 'إدارة تنبيهات الأسعار الخاصة بك.' },
    mePortfolio: { title: 'المحفظة', description: 'تتبع محفظتك الاستثمارية.' },
    meWatchlist: { title: 'قائمة المتابعة', description: 'إدارة قائمة المتابعة الخاصة بك.' },
    meSettings: { title: 'الإعدادات', description: 'إعدادات حسابك.' },
    meSavedNews: { title: 'الأخبار المحفوظة', description: 'الأخبار التي قمت بحفظها.' },
    authLogin: { title: 'تسجيل الدخول', description: 'سجل دخولك إلى حسابك في مرصادنا.' },
    authRegister: { title: 'إنشاء حساب', description: 'أنشئ حسابك في مرصادنا.' },
    authForgotPassword: { title: 'استعادة كلمة المرور', description: 'استعادة كلمة مرور حسابك.' },
    authResetPassword: { title: 'إعادة تعيين كلمة المرور', description: 'إعادة تعيين كلمة مرور حسابك.' },
    authVerifyOtp: { title: 'التحقق من الرمز', description: 'تحقق من رمز التأكيد.' },
  },
} as const;

type PageKey = keyof typeof SEO_CONFIG.pages;

interface BuildMetadataOptions {
  noindex?: boolean;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  overrides?: Partial<Metadata>;
}

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '' : path.startsWith('/') ? path : `/${path}`}`;
}

export function buildMetadata(pageKey: PageKey, options: BuildMetadataOptions = {}): Metadata {
  const page = SEO_CONFIG.pages[pageKey];
  const { noindex = false, canonicalPath, ogType = 'website', overrides = {} } = options;
  const canonical = canonicalPath ? absoluteUrl(canonicalPath) : undefined;

  return {
    title: page.title,
    description: page.description,
    robots: noindex ? { index: false, follow: false } : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${page.title} | ${SEO_CONFIG.site.nameAr}`,
      description: page.description,
      type: ogType,
      locale: 'ar_EG',
      siteName: SEO_CONFIG.site.nameAr,
      url: canonical,
      images: [{ url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: SEO_CONFIG.site.nameAr }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${SEO_CONFIG.site.nameAr}`,
      description: page.description,
      images: [absoluteUrl('/opengraph-image')],
    },
    ...overrides,
  };
}
