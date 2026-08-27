import { NewsItem, NewsSource, NewsCategory } from '@/types/news';

/**
 * Mock news sources
 */
export const MOCK_SOURCES: NewsSource[] = [
  {
    id: 'reuters',
    name: 'Reuters',
    nameAr: 'رويترز',
    logo: 'https://www.reuters.com/pf/resources/images/reuters/logo.svg',
    url: 'https://www.reuters.com',
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    nameAr: 'بلومبرغ',
    logo: 'https://www.bloomberg.com/favicon.ico',
    url: 'https://www.bloomberg.com',
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    nameAr: 'الجزيرة',
    logo: 'https://www.aljazeera.com/favicon.ico',
    url: 'https://www.aljazeera.com',
  },
  {
    id: 'cnbc',
    name: 'CNBC Arabia',
    nameAr: 'سي إن بي سي عربية',
    logo: 'https://www.cnbcarabia.com/favicon.ico',
    url: 'https://www.cnbcarabia.com',
  },
  {
    id: 'masrawy',
    name: 'Masrawy',
    nameAr: 'مصراوي',
    logo: 'https://www.masrawy.com/favicon.ico',
    url: 'https://www.masrawy.com',
  },
];

/**
 * Generate a date string for X hours ago
 */
function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

/**
 * Mock news items
 */
export const MOCK_NEWS: NewsItem[] = [
  // Breaking/Featured Gold News
  {
    id: '1',
    slug: 'gold-prices-surge-global-uncertainty',
    title: 'Gold Prices Surge Amid Global Economic Uncertainty',
    titleAr: 'ارتفاع أسعار الذهب وسط حالة عدم اليقين الاقتصادي العالمي',
    excerpt: 'Gold prices reached new highs as investors seek safe-haven assets amid growing concerns about global economic stability.',
    excerptAr: 'وصلت أسعار الذهب إلى مستويات قياسية جديدة مع توجه المستثمرين نحو الأصول الآمنة وسط مخاوف متزايدة بشأن الاستقرار الاقتصادي العالمي.',
    content: `<p>Gold prices surged to new record highs today as investors increasingly turned to safe-haven assets amid growing concerns about global economic stability and geopolitical tensions.</p>
<p>The precious metal climbed 2.5% in early trading, reaching $2,150 per ounce, marking its highest level since 2020. Analysts attribute this surge to a combination of factors including inflation concerns, currency volatility, and uncertainty in global markets.</p>
<h2>Key Factors Driving Gold Prices</h2>
<ul>
<li>Persistent inflation concerns in major economies</li>
<li>Central bank gold purchases reaching record levels</li>
<li>Geopolitical tensions affecting market sentiment</li>
<li>Weakening dollar supporting gold prices</li>
</ul>
<p>Market experts suggest that gold could continue its upward trajectory in the coming months as investors seek to diversify their portfolios and hedge against potential economic downturns.</p>`,
    contentAr: `<p>ارتفعت أسعار الذهب إلى مستويات قياسية جديدة اليوم مع توجه المستثمرين بشكل متزايد نحو الأصول الآمنة وسط مخاوف متزايدة بشأن الاستقرار الاقتصادي العالمي والتوترات الجيوسياسية.</p>
<p>صعد المعدن الثمين بنسبة 2.5% في التداولات المبكرة، ليصل إلى 2,150 دولاراً للأونصة، مسجلاً أعلى مستوى له منذ عام 2020. يعزو المحللون هذا الارتفاع إلى مجموعة من العوامل تشمل مخاوف التضخم وتقلبات العملات وعدم اليقين في الأسواق العالمية.</p>
<h2>العوامل الرئيسية الدافعة لأسعار الذهب</h2>
<ul>
<li>استمرار مخاوف التضخم في الاقتصادات الكبرى</li>
<li>مشتريات البنوك المركزية من الذهب تصل إلى مستويات قياسية</li>
<li>التوترات الجيوسياسية تؤثر على معنويات السوق</li>
<li>ضعف الدولار يدعم أسعار الذهب</li>
</ul>
<p>يشير خبراء السوق إلى أن الذهب قد يواصل مساره الصاعد في الأشهر المقبلة مع سعي المستثمرين لتنويع محافظهم والتحوط ضد الانكماش الاقتصادي المحتمل.</p>`,
    category: 'gold',
    tags: ['gold', 'investment', 'safe-haven', 'markets'],
    thumbnail: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80',
    source: MOCK_SOURCES[0],
    author: 'Financial Desk',
    authorAr: 'المكتب المالي',
    publishedAt: hoursAgo(1),
    readingTimeMinutes: 4,
    isFeatured: true,
    isBreaking: true,
    viewCount: 15420,
    relatedNewsIds: ['2', '5', '8'],
  },
  // Politics News
  {
    id: '2',
    slug: 'central-bank-gold-reserves-increase',
    title: 'Central Bank Increases Gold Reserves to Historic Levels',
    titleAr: 'البنك المركزي يرفع احتياطيات الذهب إلى مستويات تاريخية',
    excerpt: 'The Central Bank announced a significant increase in gold reserves as part of its strategy to diversify foreign currency holdings.',
    excerptAr: 'أعلن البنك المركزي عن زيادة كبيرة في احتياطيات الذهب كجزء من استراتيجيته لتنويع حيازات العملات الأجنبية.',
    content: `<p>In a strategic move to strengthen the national economy, the Central Bank has announced a substantial increase in its gold reserves, reaching historic levels not seen in decades.</p>
<p>The decision comes as part of a broader effort to reduce dependence on the US dollar and protect the economy from global currency fluctuations.</p>`,
    contentAr: `<p>في خطوة استراتيجية لتعزيز الاقتصاد الوطني، أعلن البنك المركزي عن زيادة كبيرة في احتياطياته من الذهب، لتصل إلى مستويات تاريخية لم تشهدها البلاد منذ عقود.</p>
<p>يأتي هذا القرار كجزء من جهود أوسع لتقليل الاعتماد على الدولار الأمريكي وحماية الاقتصاد من تقلبات العملات العالمية.</p>`,
    category: 'politics',
    tags: ['central-bank', 'gold-reserves', 'monetary-policy'],
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    source: MOCK_SOURCES[2],
    author: 'Economic Affairs',
    authorAr: 'الشؤون الاقتصادية',
    publishedAt: hoursAgo(3),
    readingTimeMinutes: 3,
    isFeatured: true,
    isBreaking: false,
    viewCount: 8930,
    relatedNewsIds: ['1', '6'],
  },
  // Silver News
  {
    id: '3',
    slug: 'silver-industrial-demand-boost',
    title: 'Silver Prices Rise on Strong Industrial Demand',
    titleAr: 'ارتفاع أسعار الفضة بدعم من الطلب الصناعي القوي',
    excerpt: 'Silver prices continue to climb as industrial demand from renewable energy and electronics sectors reaches new heights.',
    excerptAr: 'تواصل أسعار الفضة ارتفاعها مع وصول الطلب الصناعي من قطاعي الطاقة المتجددة والإلكترونيات إلى مستويات جديدة.',
    content: `<p>Silver has emerged as one of the best-performing precious metals this year, driven by surging industrial demand from the renewable energy sector and electronics manufacturing.</p>
<p>The metal's unique properties make it essential for solar panels, electric vehicles, and various electronic components, contributing to its sustained price appreciation.</p>`,
    contentAr: `<p>برزت الفضة كواحدة من أفضل المعادن الثمينة أداءً هذا العام، مدفوعة بالطلب الصناعي المتزايد من قطاع الطاقة المتجددة وتصنيع الإلكترونيات.</p>
<p>تجعل الخصائص الفريدة للمعدن منه عنصراً أساسياً في الألواح الشمسية والسيارات الكهربائية ومختلف المكونات الإلكترونية، مما يساهم في ارتفاع سعره المستمر.</p>`,
    category: 'silver',
    tags: ['silver', 'industrial-demand', 'renewable-energy'],
    thumbnail: 'https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=800&q=80',
    source: MOCK_SOURCES[1],
    author: 'Commodities Desk',
    authorAr: 'مكتب السلع',
    publishedAt: hoursAgo(5),
    readingTimeMinutes: 3,
    isFeatured: false,
    isBreaking: false,
    viewCount: 5240,
    relatedNewsIds: ['1', '8'],
  },
  // Currency News
  {
    id: '4',
    slug: 'egyptian-pound-stabilizes',
    title: 'Egyptian Pound Shows Signs of Stabilization',
    titleAr: 'الجنيه المصري يظهر علامات استقرار',
    excerpt: 'The Egyptian pound has shown positive signs of stabilization following recent economic reforms and increased foreign investment.',
    excerptAr: 'أظهر الجنيه المصري علامات إيجابية على الاستقرار في أعقاب الإصلاحات الاقتصادية الأخيرة وزيادة الاستثمارات الأجنبية.',
    content: `<p>The Egyptian pound has demonstrated remarkable stability in recent trading sessions, marking a significant shift from the volatility witnessed earlier this year.</p>
<p>Analysts attribute this improvement to a combination of successful economic reforms, increased foreign direct investment, and growing confidence in the local market.</p>`,
    contentAr: `<p>أظهر الجنيه المصري استقراراً ملحوظاً في جلسات التداول الأخيرة، مما يمثل تحولاً كبيراً عن التقلبات التي شهدها في وقت سابق من هذا العام.</p>
<p>يعزو المحللون هذا التحسن إلى مجموعة من الإصلاحات الاقتصادية الناجحة وزيادة الاستثمار الأجنبي المباشر والثقة المتزايدة في السوق المحلية.</p>`,
    category: 'currencies',
    tags: ['egyptian-pound', 'currency', 'forex', 'economy'],
    thumbnail: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80',
    source: MOCK_SOURCES[3],
    author: 'Currency Watch',
    authorAr: 'متابعة العملات',
    publishedAt: hoursAgo(6),
    readingTimeMinutes: 4,
    isFeatured: false,
    isBreaking: false,
    viewCount: 12350,
    relatedNewsIds: ['6', '9'],
  },
  // Economy News
  {
    id: '5',
    slug: 'inflation-rates-decline',
    title: 'Inflation Rates Show Signs of Decline',
    titleAr: 'معدلات التضخم تظهر علامات على التراجع',
    excerpt: 'Latest economic data suggests inflation is beginning to cool, offering hope for consumers and investors alike.',
    excerptAr: 'تشير أحدث البيانات الاقتصادية إلى أن التضخم بدأ في التراجع، مما يوفر أملاً للمستهلكين والمستثمرين على حد سواء.',
    content: `<p>Recent economic indicators point to a gradual decline in inflation rates, providing relief to households struggling with rising costs.</p>
<p>The central bank's monetary policy measures appear to be taking effect, with price increases slowing across multiple sectors.</p>`,
    contentAr: `<p>تشير المؤشرات الاقتصادية الأخيرة إلى انخفاض تدريجي في معدلات التضخم، مما يوفر راحة للأسر التي تعاني من ارتفاع التكاليف.</p>
<p>يبدو أن إجراءات السياسة النقدية للبنك المركزي بدأت تؤتي ثمارها، مع تباطؤ ارتفاع الأسعار في قطاعات متعددة.</p>`,
    category: 'economy',
    tags: ['inflation', 'economy', 'monetary-policy'],
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    source: MOCK_SOURCES[4],
    author: 'Economic Analysis',
    authorAr: 'التحليل الاقتصادي',
    publishedAt: hoursAgo(8),
    readingTimeMinutes: 5,
    isFeatured: false,
    isBreaking: false,
    viewCount: 7820,
    relatedNewsIds: ['2', '4'],
  },
  // Crypto News
  {
    id: '6',
    slug: 'bitcoin-institutional-adoption',
    title: 'Bitcoin Sees Increased Institutional Adoption',
    titleAr: 'بيتكوين تشهد زيادة في التبني المؤسسي',
    excerpt: 'Major financial institutions are increasingly adding Bitcoin to their portfolios, signaling growing mainstream acceptance.',
    excerptAr: 'تضيف المؤسسات المالية الكبرى بشكل متزايد البيتكوين إلى محافظها، مما يشير إلى تزايد القبول السائد.',
    content: `<p>Bitcoin continues to gain traction among institutional investors, with several major financial firms announcing significant cryptocurrency allocations.</p>
<p>This trend reflects a broader shift in perception of digital assets from speculative investments to legitimate portfolio diversification tools.</p>`,
    contentAr: `<p>تواصل البيتكوين اكتساب زخم بين المستثمرين المؤسسيين، مع إعلان العديد من الشركات المالية الكبرى عن تخصيصات كبيرة للعملات المشفرة.</p>
<p>يعكس هذا الاتجاه تحولاً أوسع في نظرة الأصول الرقمية من استثمارات مضاربة إلى أدوات مشروعة لتنويع المحافظ.</p>`,
    category: 'crypto',
    tags: ['bitcoin', 'cryptocurrency', 'institutional-investment'],
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
    source: MOCK_SOURCES[1],
    author: 'Crypto Desk',
    authorAr: 'مكتب العملات الرقمية',
    publishedAt: hoursAgo(10),
    readingTimeMinutes: 4,
    isFeatured: false,
    isBreaking: false,
    viewCount: 9540,
    relatedNewsIds: ['5', '4'],
  },
  // More Gold News
  {
    id: '7',
    slug: 'gold-jewelry-demand-egypt',
    title: 'Gold Jewelry Demand Rises in Egypt',
    titleAr: 'ارتفاع الطلب على المجوهرات الذهبية في مصر',
    excerpt: 'Local gold jewelry markets see increased activity as consumers look to gold as both adornment and investment.',
    excerptAr: 'تشهد أسواق المجوهرات الذهبية المحلية نشاطاً متزايداً مع توجه المستهلكين نحو الذهب كزينة واستثمار.',
    content: `<p>Egypt's gold jewelry market has experienced a notable uptick in demand, driven by a combination of cultural preferences and investment considerations.</p>
<p>Jewelers report increased foot traffic and sales, particularly during the wedding season and religious holidays.</p>`,
    contentAr: `<p>شهد سوق المجوهرات الذهبية في مصر ارتفاعاً ملحوظاً في الطلب، مدفوعاً بمزيج من التفضيلات الثقافية واعتبارات الاستثمار.</p>
<p>يفيد تجار المجوهرات بزيادة حركة العملاء والمبيعات، خاصة خلال موسم الأعراس والأعياد الدينية.</p>`,
    category: 'gold',
    tags: ['gold-jewelry', 'egypt', 'consumer-demand'],
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    source: MOCK_SOURCES[4],
    author: 'Market Watch',
    authorAr: 'متابعة السوق',
    publishedAt: hoursAgo(12),
    readingTimeMinutes: 3,
    isFeatured: false,
    isBreaking: false,
    viewCount: 6230,
    relatedNewsIds: ['1', '2'],
  },
  // Politics/Economy
  {
    id: '8',
    slug: 'government-economic-reforms',
    title: 'Government Announces New Economic Reform Package',
    titleAr: 'الحكومة تعلن عن حزمة إصلاحات اقتصادية جديدة',
    excerpt: 'A comprehensive package of economic reforms aims to boost growth, attract investment, and stabilize prices.',
    excerptAr: 'تهدف حزمة شاملة من الإصلاحات الاقتصادية إلى تعزيز النمو وجذب الاستثمارات واستقرار الأسعار.',
    content: `<p>The government has unveiled a new comprehensive economic reform package designed to accelerate growth and attract foreign investment.</p>
<p>Key measures include tax incentives for investors, streamlined bureaucratic procedures, and enhanced support for small businesses.</p>`,
    contentAr: `<p>كشفت الحكومة عن حزمة إصلاحات اقتصادية شاملة جديدة تهدف إلى تسريع النمو وجذب الاستثمارات الأجنبية.</p>
<p>تشمل الإجراءات الرئيسية حوافز ضريبية للمستثمرين وتبسيط الإجراءات البيروقراطية وتعزيز الدعم للشركات الصغيرة.</p>`,
    category: 'politics',
    tags: ['economic-reforms', 'government', 'investment'],
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
    source: MOCK_SOURCES[2],
    author: 'Political Desk',
    authorAr: 'المكتب السياسي',
    publishedAt: hoursAgo(14),
    readingTimeMinutes: 5,
    isFeatured: false,
    isBreaking: false,
    viewCount: 11200,
    relatedNewsIds: ['2', '5'],
  },
  // Currency News
  {
    id: '9',
    slug: 'dollar-euro-exchange-rates',
    title: 'Dollar and Euro Exchange Rates Update',
    titleAr: 'تحديث أسعار صرف الدولار واليورو',
    excerpt: 'Latest exchange rates show mixed movements as global currency markets respond to economic data releases.',
    excerptAr: 'تظهر أحدث أسعار الصرف تحركات متباينة مع استجابة أسواق العملات العالمية لإصدارات البيانات الاقتصادية.',
    content: `<p>Currency markets showed mixed movements today as traders digested the latest economic data from major economies.</p>
<p>The US dollar showed strength against emerging market currencies while the Euro remained relatively stable.</p>`,
    contentAr: `<p>أظهرت أسواق العملات تحركات متباينة اليوم حيث استوعب المتداولون أحدث البيانات الاقتصادية من الاقتصادات الكبرى.</p>
<p>أظهر الدولار الأمريكي قوة أمام عملات الأسواق الناشئة بينما ظل اليورو مستقراً نسبياً.</p>`,
    category: 'currencies',
    tags: ['dollar', 'euro', 'exchange-rates'],
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
    source: MOCK_SOURCES[3],
    author: 'Forex Analysis',
    authorAr: 'تحليل الفوركس',
    publishedAt: hoursAgo(16),
    readingTimeMinutes: 3,
    isFeatured: false,
    isBreaking: false,
    viewCount: 8450,
    relatedNewsIds: ['4', '5'],
  },
  // Silver News
  {
    id: '10',
    slug: 'silver-price-forecast',
    title: 'Analysts Raise Silver Price Forecasts',
    titleAr: 'المحللون يرفعون توقعات أسعار الفضة',
    excerpt: 'Major investment banks have revised their silver price forecasts upward, citing strong fundamentals and growing demand.',
    excerptAr: 'رفعت البنوك الاستثمارية الكبرى توقعاتها لأسعار الفضة، مستشهدة بالأساسيات القوية والطلب المتزايد.',
    content: `<p>Several major investment banks have raised their silver price forecasts for the coming year, reflecting optimism about the metal's prospects.</p>
<p>The revisions come amid strong industrial demand and renewed investor interest in precious metals.</p>`,
    contentAr: `<p>رفعت العديد من البنوك الاستثمارية الكبرى توقعاتها لأسعار الفضة للعام المقبل، مما يعكس التفاؤل بشأن آفاق المعدن.</p>
<p>تأتي هذه المراجعات وسط طلب صناعي قوي واهتمام متجدد من المستثمرين بالمعادن الثمينة.</p>`,
    category: 'silver',
    tags: ['silver', 'price-forecast', 'investment'],
    thumbnail: 'https://images.unsplash.com/photo-1607292803062-5b8ff0531b88?w=800&q=80',
    source: MOCK_SOURCES[0],
    author: 'Research Desk',
    authorAr: 'مكتب الأبحاث',
    publishedAt: hoursAgo(18),
    readingTimeMinutes: 4,
    isFeatured: false,
    isBreaking: false,
    viewCount: 4890,
    relatedNewsIds: ['3', '1'],
  },
  // Economy News
  {
    id: '11',
    slug: 'gdp-growth-exceeds-expectations',
    title: 'GDP Growth Exceeds Expectations',
    titleAr: 'نمو الناتج المحلي يتجاوز التوقعات',
    excerpt: 'The latest GDP figures show stronger than expected economic growth, driven by exports and domestic consumption.',
    excerptAr: 'تظهر أحدث أرقام الناتج المحلي الإجمالي نمواً اقتصادياً أقوى من المتوقع، مدفوعاً بالصادرات والاستهلاك المحلي.',
    content: `<p>Economic growth exceeded analyst expectations in the latest quarterly report, with GDP rising at a faster pace than previously anticipated.</p>
<p>Key contributors to this growth include robust exports, increased consumer spending, and recovering tourism sector.</p>`,
    contentAr: `<p>تجاوز النمو الاقتصادي توقعات المحللين في أحدث تقرير ربع سنوي، حيث ارتفع الناتج المحلي الإجمالي بوتيرة أسرع مما كان متوقعاً.</p>
<p>تشمل المساهمون الرئيسيون في هذا النمو الصادرات القوية وزيادة إنفاق المستهلكين وتعافي قطاع السياحة.</p>`,
    category: 'economy',
    tags: ['gdp', 'economic-growth', 'exports'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    source: MOCK_SOURCES[3],
    author: 'Economic Bureau',
    authorAr: 'المكتب الاقتصادي',
    publishedAt: hoursAgo(20),
    readingTimeMinutes: 4,
    isFeatured: false,
    isBreaking: false,
    viewCount: 6780,
    relatedNewsIds: ['5', '8'],
  },
  // Crypto News
  {
    id: '12',
    slug: 'ethereum-network-upgrade',
    title: 'Ethereum Network Completes Major Upgrade',
    titleAr: 'شبكة إيثريوم تكمل ترقية رئيسية',
    excerpt: 'The Ethereum blockchain has successfully completed a significant upgrade, improving transaction speeds and reducing fees.',
    excerptAr: 'أكملت سلسلة بلوكشين إيثريوم بنجاح ترقية كبيرة، مما يحسن سرعات المعاملات ويخفض الرسوم.',
    content: `<p>Ethereum, the world's second-largest cryptocurrency by market cap, has successfully completed a major network upgrade.</p>
<p>The upgrade promises to significantly improve transaction throughput and reduce gas fees, making the network more accessible for users.</p>`,
    contentAr: `<p>أكملت إيثريوم، ثاني أكبر عملة مشفرة في العالم من حيث القيمة السوقية، ترقية رئيسية للشبكة بنجاح.</p>
<p>تعد الترقية بتحسين كبير في إنتاجية المعاملات وخفض رسوم الغاز، مما يجعل الشبكة أكثر سهولة للمستخدمين.</p>`,
    category: 'crypto',
    tags: ['ethereum', 'blockchain', 'upgrade'],
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
    source: MOCK_SOURCES[1],
    author: 'Tech Desk',
    authorAr: 'مكتب التقنية',
    publishedAt: hoursAgo(22),
    readingTimeMinutes: 4,
    isFeatured: false,
    isBreaking: false,
    viewCount: 7650,
    relatedNewsIds: ['6'],
  },
];

/**
 * Get news by category
 */
export function getNewsByCategory(category?: NewsCategory): NewsItem[] {
  if (!category) return MOCK_NEWS;
  return MOCK_NEWS.filter((news) => news.category === category);
}

/**
 * Get news by slug
 */
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return MOCK_NEWS.find((news) => news.slug === slug);
}

/**
 * Get related news
 */
export function getRelatedNews(newsId: string): NewsItem[] {
  const news = MOCK_NEWS.find((n) => n.id === newsId);
  if (!news?.relatedNewsIds) return [];
  return MOCK_NEWS.filter((n) => news.relatedNewsIds?.includes(n.id));
}

/**
 * Get featured news
 */
export function getFeaturedNews(): NewsItem[] {
  return MOCK_NEWS.filter((news) => news.isFeatured);
}

/**
 * Get breaking news
 */
export function getBreakingNews(): NewsItem[] {
  return MOCK_NEWS.filter((news) => news.isBreaking);
}

/**
 * Search news
 */
export function searchNews(query: string, category?: NewsCategory): NewsItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  let results = MOCK_NEWS;

  if (category) {
    results = results.filter((news) => news.category === category);
  }

  if (normalizedQuery) {
    results = results.filter(
      (news) =>
        news.title.toLowerCase().includes(normalizedQuery) ||
        news.titleAr.includes(normalizedQuery) ||
        news.excerpt.toLowerCase().includes(normalizedQuery) ||
        news.excerptAr.includes(normalizedQuery) ||
        news.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  }

  return results;
}
