/**
 * Mock Currency Data
 * Single source of truth for all currency rates and bank data
 */

export const CURRENCIES = ['USD', 'EUR', 'SAR', 'AED', 'KWD', 'GBP'] as const;

export type CurrencyCode = typeof CURRENCIES[number];

export interface CurrencyRate {
  buy: number;
  sell: number;
  history?: number[]; // Optional: Price history for sparklines (last 24h)
}

export interface MarketPulse {
  official: CurrencyRate;
  parallel: CurrencyRate;
  usdt: CurrencyRate & {
    change24h: number; // percentage
  };
}

export interface Bank {
  id: string;
  code?: string;
  name: string;
  logo: string;
  isLive?: boolean;
  lastCheckedAtForHuman?: string;
  rates: Record<CurrencyCode, CurrencyRate>;
}

/**
 * Market Pulse - USD Rates for different markets
 */
export const MARKET_PULSE: MarketPulse = {
  official: {
    buy: 48.50,
    sell: 48.60,
  },
  parallel: {
    buy: 63.20,
    sell: 63.50,
  },
  usdt: {
    buy: 63.00,
    sell: 63.30,
    change24h: -0.8, // -0.8% in last 24h
  },
};

/**
 * Banks Data - Array of banks with their exchange rates
 */
export const BANKS_DATA: Bank[] = [
  {
    id: 'ahli',
    name: 'البنك الأهلي',
    logo: 'https://via.placeholder.com/48/0958cf/ffffff?text=البنك+الأهلي',
    rates: {
      USD: { buy: 48.50, sell: 48.60, history: [48.2, 48.3, 48.4, 48.45, 48.5] },
      EUR: { buy: 52.10, sell: 52.40, history: [51.8, 51.9, 52.0, 52.05, 52.1] },
      SAR: { buy: 12.90, sell: 12.95, history: [12.85, 12.87, 12.88, 12.89, 12.9] },
      AED: { buy: 13.15, sell: 13.20, history: [13.1, 13.12, 13.13, 13.14, 13.15] },
      KWD: { buy: 157.80, sell: 158.20, history: [157.5, 157.6, 157.7, 157.75, 157.8] },
      GBP: { buy: 60.50, sell: 60.90, history: [60.2, 60.3, 60.4, 60.45, 60.5] },
    },
  },
  {
    id: 'misr',
    name: 'بنك مصر',
    logo: 'https://via.placeholder.com/48/d97706/ffffff?text=بنك+مصر',
    rates: {
      USD: { buy: 48.55, sell: 48.65, history: [48.3, 48.4, 48.5, 48.52, 48.55] },
      EUR: { buy: 52.20, sell: 52.50, history: [51.9, 52.0, 52.1, 52.15, 52.2] },
      SAR: { buy: 12.92, sell: 12.97, history: [12.87, 12.89, 12.90, 12.91, 12.92] },
      AED: { buy: 13.17, sell: 13.22, history: [13.12, 13.14, 13.15, 13.16, 13.17] },
      KWD: { buy: 158.00, sell: 158.40, history: [157.7, 157.8, 157.9, 157.95, 158.0] },
      GBP: { buy: 60.60, sell: 61.00, history: [60.3, 60.4, 60.5, 60.55, 60.6] },
    },
  },
  {
    id: 'cib',
    name: 'البنك التجاري الدولي',
    logo: 'https://via.placeholder.com/48/0369a1/ffffff?text=CIB',
    rates: {
      USD: { buy: 48.48, sell: 48.58, history: [48.5, 48.49, 48.48, 48.47, 48.48] },
      EUR: { buy: 52.05, sell: 52.35, history: [52.1, 52.08, 52.06, 52.04, 52.05] },
      SAR: { buy: 12.88, sell: 12.93, history: [12.9, 12.89, 12.88, 12.87, 12.88] },
      AED: { buy: 13.13, sell: 13.18, history: [13.15, 13.14, 13.13, 13.12, 13.13] },
      KWD: { buy: 157.70, sell: 158.10, history: [157.8, 157.75, 157.72, 157.71, 157.7] },
      GBP: { buy: 60.45, sell: 60.85, history: [60.5, 60.48, 60.46, 60.45, 60.45] },
    },
  },
  {
    id: 'alex',
    name: 'بنك الإسكندرية',
    logo: 'https://via.placeholder.com/48/16a34a/ffffff?text=بنك+الإسكندرية',
    rates: {
      USD: { buy: 48.52, sell: 48.62, history: [48.3, 48.4, 48.45, 48.5, 48.52] },
      EUR: { buy: 52.15, sell: 52.45, history: [51.9, 52.0, 52.1, 52.12, 52.15] },
      SAR: { buy: 12.91, sell: 12.96, history: [12.88, 12.89, 12.90, 12.905, 12.91] },
      AED: { buy: 13.16, sell: 13.21, history: [13.13, 13.14, 13.15, 13.155, 13.16] },
      KWD: { buy: 157.90, sell: 158.30, history: [157.7, 157.8, 157.85, 157.88, 157.9] },
      GBP: { buy: 60.55, sell: 60.95, history: [60.3, 60.4, 60.5, 60.52, 60.55] },
    },
  },
  {
    id: 'cairo',
    name: 'بنك القاهرة',
    logo: 'https://via.placeholder.com/48/dc2626/ffffff?text=بنك+القاهرة',
    rates: {
      USD: { buy: 48.53, sell: 48.63, history: [48.3, 48.4, 48.45, 48.5, 48.53] },
      EUR: { buy: 52.18, sell: 52.48, history: [51.95, 52.05, 52.12, 52.15, 52.18] },
      SAR: { buy: 12.93, sell: 12.98, history: [12.9, 12.91, 12.92, 12.925, 12.93] },
      AED: { buy: 13.18, sell: 13.23, history: [13.15, 13.16, 13.17, 13.175, 13.18] },
      KWD: { buy: 158.10, sell: 158.50, history: [157.9, 158.0, 158.05, 158.08, 158.1] },
      GBP: { buy: 60.65, sell: 61.05, history: [60.4, 60.5, 60.6, 60.62, 60.65] },
    },
  },
  {
    id: 'nbe',
    name: 'البنك الأهلي المصري',
    logo: 'https://via.placeholder.com/48/7c3aed/ffffff?text=NBE',
    rates: {
      USD: { buy: 48.51, sell: 48.61, history: [48.25, 48.35, 48.42, 48.48, 48.51] },
      EUR: { buy: 52.12, sell: 52.42, history: [51.85, 51.95, 52.05, 52.08, 52.12] },
      SAR: { buy: 12.90, sell: 12.95, history: [12.87, 12.88, 12.89, 12.895, 12.9] },
      AED: { buy: 13.15, sell: 13.20, history: [13.12, 13.13, 13.14, 13.145, 13.15] },
      KWD: { buy: 157.85, sell: 158.25, history: [157.65, 157.75, 157.8, 157.83, 157.85] },
      GBP: { buy: 60.52, sell: 60.92, history: [60.28, 60.38, 60.48, 60.5, 60.52] },
    },
  },
  {
    id: 'hsbc',
    name: 'HSBC مصر',
    logo: 'https://via.placeholder.com/48/ef4444/ffffff?text=HSBC',
    rates: {
      USD: { buy: 48.47, sell: 48.57, history: [48.5, 48.49, 48.48, 48.47, 48.47] },
      EUR: { buy: 52.08, sell: 52.38, history: [52.1, 52.09, 52.08, 52.07, 52.08] },
      SAR: { buy: 12.87, sell: 12.92, history: [12.89, 12.88, 12.87, 12.86, 12.87] },
      AED: { buy: 13.12, sell: 13.17, history: [13.14, 13.13, 13.12, 13.11, 13.12] },
      KWD: { buy: 157.65, sell: 158.05, history: [157.75, 157.7, 157.68, 157.66, 157.65] },
      GBP: { buy: 60.42, sell: 60.82, history: [60.45, 60.44, 60.43, 60.42, 60.42] },
    },
  },
  {
    id: 'arab-african',
    name: 'البنك العربي الأفريقي',
    logo: 'https://via.placeholder.com/48/0891b2/ffffff?text=العربي+الأفريقي',
    rates: {
      USD: { buy: 48.54, sell: 48.64, history: [48.3, 48.4, 48.48, 48.52, 48.54] },
      EUR: { buy: 52.22, sell: 52.52, history: [51.98, 52.08, 52.15, 52.19, 52.22] },
      SAR: { buy: 12.94, sell: 12.99, history: [12.91, 12.92, 12.93, 12.935, 12.94] },
      AED: { buy: 13.19, sell: 13.24, history: [13.16, 13.17, 13.18, 13.185, 13.19] },
      KWD: { buy: 158.15, sell: 158.55, history: [157.95, 158.05, 158.1, 158.13, 158.15] },
      GBP: { buy: 60.68, sell: 61.08, history: [60.43, 60.53, 60.63, 60.66, 60.68] },
    },
  },
  {
    id: 'credit-agricole',
    name: 'كريدي أجريكول',
    logo: 'https://via.placeholder.com/48/059669/ffffff?text=كريدي+أجريكول',
    rates: {
      USD: { buy: 48.49, sell: 48.59, history: [48.5, 48.49, 48.48, 48.485, 48.49] },
      EUR: { buy: 52.09, sell: 52.39, history: [52.1, 52.09, 52.08, 52.085, 52.09] },
      SAR: { buy: 12.89, sell: 12.94, history: [12.91, 12.90, 12.89, 12.888, 12.89] },
      AED: { buy: 13.14, sell: 13.19, history: [13.16, 13.15, 13.14, 13.138, 13.14] },
      KWD: { buy: 157.75, sell: 158.15, history: [157.8, 157.78, 157.76, 157.755, 157.75] },
      GBP: { buy: 60.48, sell: 60.88, history: [60.5, 60.49, 60.48, 60.479, 60.48] },
    },
  },
  {
    id: 'emirates-nbd',
    name: 'بنك الإمارات دبي الوطني',
    logo: 'https://via.placeholder.com/48/ea580c/ffffff?text=Emirates+NBD',
    rates: {
      USD: { buy: 48.56, sell: 48.66, history: [48.32, 48.42, 48.5, 48.54, 48.56] },
      EUR: { buy: 52.25, sell: 52.55, history: [52.0, 52.1, 52.18, 52.22, 52.25] },
      SAR: { buy: 12.95, sell: 13.00, history: [12.92, 12.93, 12.94, 12.945, 12.95] },
      AED: { buy: 13.20, sell: 13.25, history: [13.17, 13.18, 13.19, 13.195, 13.2] },
      KWD: { buy: 158.20, sell: 158.60, history: [158.0, 158.1, 158.15, 158.18, 158.2] },
      GBP: { buy: 60.70, sell: 61.10, history: [60.45, 60.55, 60.65, 60.68, 60.7] },
    },
  },
];

/**
 * Helper Functions
 */

// Get the bank with the best buy rate for a currency
export function getBestBuyRate(currency: CurrencyCode): {
  bank: Bank;
  rate: number;
} {
  const sorted = [...BANKS_DATA].sort(
    (a, b) => b.rates[currency].buy - a.rates[currency].buy
  );
  return {
    bank: sorted[0],
    rate: sorted[0].rates[currency].buy,
  };
}

// Get the bank with the best sell rate for a currency
export function getBestSellRate(currency: CurrencyCode): {
  bank: Bank;
  rate: number;
} {
  const sorted = [...BANKS_DATA].sort(
    (a, b) => a.rates[currency].sell - b.rates[currency].sell
  );
  return {
    bank: sorted[0],
    rate: sorted[0].rates[currency].sell,
  };
}

// Calculate the gap percentage between parallel and official market
export function calculateGapPercentage(): number {
  return (
    ((MARKET_PULSE.parallel.buy - MARKET_PULSE.official.buy) /
      MARKET_PULSE.official.buy) *
    100
  );
}

// Get average official rate from all banks
export function getAverageOfficialRate(currency: CurrencyCode): CurrencyRate {
  const total = BANKS_DATA.reduce(
    (acc, bank) => ({
      buy: acc.buy + bank.rates[currency].buy,
      sell: acc.sell + bank.rates[currency].sell,
    }),
    { buy: 0, sell: 0 }
  );

  return {
    buy: total.buy / BANKS_DATA.length,
    sell: total.sell / BANKS_DATA.length,
  };
}

// Calculate bank average for a specific currency (alias for consistency)
export function calculateBankAverage(currency: CurrencyCode): CurrencyRate {
  return getAverageOfficialRate(currency);
}

/**
 * Parallel Market Data - Rates for all currencies
 */
export const PARALLEL_DATA: Record<CurrencyCode, CurrencyRate> = {
  USD: MARKET_PULSE.parallel,
  EUR: { buy: 56.20, sell: 56.50 },
  SAR: { buy: 16.85, sell: 16.95 },
  AED: { buy: 17.20, sell: 17.30 },
  KWD: { buy: 205.50, sell: 206.00 },
  GBP: { buy: 80.20, sell: 80.60 },
};

// Calculate conversion scenarios
export interface ConversionScenario {
  label: string;
  labelAr: string;
  amount: number;
  rate: number;
  description: string;
  descriptionAr: string;
}

export function calculateConversionScenarios(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: 'EGP'
): ConversionScenario[] {
  const officialRate = getAverageOfficialRate(fromCurrency).buy;
  const parallelRate = MARKET_PULSE.parallel.buy;
  const creditCardRate = officialRate * 1.1; // 10% fee

  return [
    {
      label: 'Cash (Official)',
      labelAr: 'نقدًا (رسمي)',
      amount: amount * officialRate,
      rate: officialRate,
      description: 'Bank official exchange rate',
      descriptionAr: 'سعر الصرف الرسمي للبنوك',
    },
    {
      label: 'Black Market',
      labelAr: 'السوق الموازي',
      amount: amount * parallelRate,
      rate: parallelRate,
      description: 'Street exchange rate',
      descriptionAr: 'سعر الصرف في السوق السوداء',
    },
    {
      label: 'Credit Card',
      labelAr: 'بطاقة ائتمان',
      amount: amount * creditCardRate,
      rate: creditCardRate,
      description: 'Bank rate + 10% international fee',
      descriptionAr: 'سعر البنك + 10٪ رسوم دولية',
    },
  ];
}
