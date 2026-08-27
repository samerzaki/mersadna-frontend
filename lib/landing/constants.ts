// Product types for gold investment comparison
export const GOLD_INVESTMENT_PRODUCTS = [
  {
    id: 'physical' as const,
    title: 'Physical Bullion',
    titleAr: 'السبائك المادية',
    description: 'Direct ownership of gold bars and coins',
    descriptionAr: 'الملكية المباشرة للسبائك والعملات الذهبية',
    pros: ['Tangible ownership', 'No counterparty risk', 'Privacy', 'Easy to liquidate'],
    prosAr: ['ملكية ملموسة', 'لا يوجد مخاطر طرف ثالث', 'خصوصية عالية', 'سهولة التسييل'],
    cons: ['Storage costs', 'Insurance needed', 'Lower liquidity than ETFs', 'Security concerns'],
    consAr: ['تكاليف التخزين', 'الحاجة للتأمين', 'سيولة أقل من الصناديق', 'مخاوف أمنية'],
    riskLevel: 2,
    liquidity: 'high' as const,
    minimumInvestment: 1000,
    icon: '🪙',
  },
  {
    id: 'etf' as const,
    title: 'Gold ETFs',
    titleAr: 'صناديق الذهب المتداولة',
    description: 'Exchange-traded funds backed by physical gold',
    descriptionAr: 'صناديق متداولة مدعومة بالذهب المادي',
    pros: ['High liquidity', 'No storage needed', 'Easy to trade', 'Low minimum investment'],
    prosAr: ['سيولة عالية', 'لا حاجة للتخزين', 'سهولة التداول', 'حد أدنى منخفض للاستثمار'],
    cons: ['Management fees', 'Counterparty risk', 'Not physical ownership', 'Market hours only'],
    consAr: ['رسوم إدارية', 'مخاطر طرف ثالث', 'ليست ملكية مادية', 'ساعات السوق فقط'],
    riskLevel: 3,
    liquidity: 'high' as const,
    minimumInvestment: 100,
    icon: '📊',
  },
  {
    id: 'mining' as const,
    title: 'Gold Mining Stocks',
    titleAr: 'أسهم شركات تعدين الذهب',
    description: 'Investing in companies that mine gold',
    descriptionAr: 'الاستثمار في الشركات التي تستخرج الذهب',
    pros: ['Leverage to gold price', 'Dividend potential', 'Corporate governance', 'Diversification'],
    prosAr: ['رافعة لسعر الذهب', 'إمكانية الحصول على أرباح', 'حوكمة الشركات', 'تنويع الاستثمار'],
    cons: ['Company-specific risks', 'Management decisions', 'Political risks', 'Higher volatility'],
    consAr: ['مخاطر خاصة بالشركة', 'قرارات الإدارة', 'مخاطر سياسية', 'تقلبات أعلى'],
    riskLevel: 4,
    liquidity: 'medium' as const,
    minimumInvestment: 500,
    icon: '⛏️',
  },
  {
    id: 'futures' as const,
    title: 'Gold Futures/Options',
    titleAr: 'عقود الذهب الآجلة والخيارات',
    description: 'Derivative contracts for gold price speculation',
    descriptionAr: 'عقود اشتقاقية للمضاربة على سعر الذهب',
    pros: ['High leverage', 'No storage costs', 'Hedging capabilities', '24/7 trading'],
    prosAr: ['رافعة مالية عالية', 'لا تكاليف تخزين', 'إمكانيات التحوط', 'تداول على مدار الساعة'],
    cons: ['High risk', 'Complex instruments', 'Margin calls', 'Time decay'],
    consAr: ['مخاطر عالية', 'أدوات معقدة', 'نداءات الهامش', 'انحسار الوقت'],
    riskLevel: 5,
    liquidity: 'high' as const,
    minimumInvestment: 5000,
    icon: '📈',
  },
  {
    id: 'numismatic' as const,
    title: 'Numismatic Coins',
    titleAr: 'العملات النقدية النادرة',
    description: 'Rare and historical gold coins with collector value',
    descriptionAr: 'عملات ذهبية نادرة وتاريخية ذات قيمة جامعية',
    pros: ['Potential premium value', 'Historical significance', 'Collectible appeal', 'Tangible asset'],
    prosAr: ['قيمة علاوة محتملة', 'أهمية تاريخية', 'جاذبية الجمع', 'أصل ملموس'],
    cons: ['Expert knowledge needed', 'Illiquid market', 'Authentication costs', 'Premium pricing'],
    consAr: ['تحتاج خبرة متخصصة', 'سوق غير سائل', 'تكاليف التوثيق', 'أسعار علاوة'],
    riskLevel: 3,
    liquidity: 'low' as const,
    minimumInvestment: 2000,
    icon: '🏛️',
  },
] as const;

// Trust signals and testimonials
export const TRUST_SIGNALS = {
  stats: [
    { value: '50,000+', label: 'Active Investors', labelAr: 'مستثمر نشط' },
    { value: '98%', label: 'Satisfaction Rate', labelAr: 'معدل الرضا' },
    { value: '15+', label: 'Years Experience', labelAr: 'سنوات خبرة' },
    { value: '24/7', label: 'Market Monitoring', labelAr: 'مراقبة السوق' },
  ],
  testimonials: [
    {
      name: 'Ahmed Hassan',
      nameAr: 'أحمد حسن',
      role: 'Portfolio Manager',
      roleAr: 'مدير محفظة',
      content: 'This guide transformed my understanding of gold investment. The comparison section alone saved me months of research.',
      contentAr: 'غير هذا الدليل فهمي للاستثمار في الذهب. قسم المقارنة وحده وفر علي أشهر من البحث.',
      avatar: 'AH',
    },
    {
      name: 'Sarah Mahmoud',
      nameAr: 'سارة محمود',
      role: 'Financial Advisor',
      roleAr: 'مستشار مالي',
      content: 'Comprehensive and actionable. I recommend this to all my clients looking to diversify with gold.',
      contentAr: 'شامل وعملي. أوصي به لجميع عملائي الباحثين عن تنويع الاستثمار بالذهب.',
      avatar: 'SM',
    },
    {
      name: 'Omar Khalil',
      nameAr: 'عمر خليل',
      role: 'Private Investor',
      roleAr: 'مستثمر خاص',
      content: 'The ROI calculator helped me make informed decisions. My portfolio has grown 20% since following the strategies.',
      contentAr: 'ساعدني حاسبة العائد على اتخاذ قرارات مستنيرة. نمت محفظتي بنسبة 20% منذ اتباع الاستراتيجيات.',
      avatar: 'OK',
    },
  ],
  mediaMentions: [
    { name: 'Forbes Middle East', logo: '🏆' },
    { name: 'Bloomberg', logo: '📰' },
    { name: 'Reuters', logo: '📡' },
    { name: 'Arabian Business', logo: '💼' },
  ],
};

// CTA configurations
export const CTA_CONFIG = {
  primary: {
    text: 'Download Your Free Gold Investment Strategy Guide',
    textAr: 'حمل دليل استراتيجية الاستثمار في الذهب المجاني',
    subtext: 'Get instant access to expert insights, market analysis, and proven investment strategies.',
    subtextAr: 'احصل على فوري الوصول إلى رؤى الخبراء وتحليلات السوق واستراتيجيات الاستثمار المثبتة.',
  },
  secondary: {
    text: 'Schedule a Free, No-Obligation Portfolio Consultation',
    textAr: 'احجز استشارة مجانية لمحفظتك بدون التزام',
    subtext: 'Speak with a certified gold investment advisor to discuss your financial goals.',
    subtextAr: 'تحدث مع مستشار استثمار ذهب معتمد لمناقشة أهدافك المالية.',
  },
};

// Risk level labels
export const RISK_LEVELS = {
  1: { label: 'Very Low', labelAr: 'منخفض جداً', color: 'bg-green-500' },
  2: { label: 'Low', labelAr: 'منخفض', color: 'bg-green-400' },
  3: { label: 'Medium', labelAr: 'متوسط', color: 'bg-yellow-500' },
  4: { label: 'High', labelAr: 'عالي', color: 'bg-orange-500' },
  5: { label: 'Very High', labelAr: 'عالي جداً', color: 'bg-red-500' },
};

// Liquidity labels
export const LIQUIDITY_LABELS = {
  high: { label: 'High Liquidity', labelAr: 'سيولة عالية', icon: '💧' },
  medium: { label: 'Medium Liquidity', labelAr: 'سيولة متوسطة', icon: '💧' },
  low: { label: 'Low Liquidity', labelAr: 'سيولة منخفضة', icon: '💧' },
};

// Calculator presets
export const CALCULATOR_PRESETS = {
  timeframes: [
    { value: 1, label: '1 Year', labelAr: 'سنة واحدة' },
    { value: 3, label: '3 Years', labelAr: '3 سنوات' },
    { value: 5, label: '5 Years', labelAr: '5 سنوات' },
    { value: 10, label: '10 Years', labelAr: '10 سنوات' },
  ],
  investmentAmounts: [
    { value: 1000, label: '1,000 EGP' },
    { value: 5000, label: '5,000 EGP' },
    { value: 10000, label: '10,000 EGP' },
    { value: 50000, label: '50,000 EGP' },
    { value: 100000, label: '100,000 EGP' },
  ],
};

// Guide sections (for preview)
export const GUIDE_PREVIEW = {
  title: 'Gold Investment Strategy Guide',
  titleAr: 'دليل استراتيجية الاستثمار في الذهب',
  sections: [
    { title: 'Understanding Gold Markets', titleAr: 'فهم أسواق الذهب', pages: 12 },
    { title: 'Portfolio Allocation Strategies', titleAr: 'استراتيجيات تخصيص المحفظة', pages: 18 },
    { title: 'Risk Management Techniques', titleAr: 'تقنيات إدارة المخاطر', pages: 15 },
    { title: 'Tax Considerations', titleAr: 'الاعتبارات الضريبية', pages: 10 },
    { title: 'Market Timing Indicators', titleAr: 'مؤشرات توقيت السوق', pages: 14 },
    { title: 'Case Studies & Examples', titleAr: 'دراسات حالة وأمثلة', pages: 20 },
  ],
  totalPages: 89,
};
