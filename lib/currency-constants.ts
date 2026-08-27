// Currency constants

export const CURRENCIES = [
  { code: 'USD', name: 'الدولار الأمريكي', nameEn: 'US Dollar', symbol: '$', flag: '🇺🇸', displayOrder: 1 },
  { code: 'EUR', name: 'اليورو', nameEn: 'Euro', symbol: '€', flag: '🇪🇺', displayOrder: 2 },
  { code: 'GBP', name: 'الجنيه الإسترليني', nameEn: 'British Pound', symbol: '£', flag: '🇬🇧', displayOrder: 3 },
  { code: 'SAR', name: 'الريال السعودي', nameEn: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦', displayOrder: 4 },
  { code: 'AED', name: 'الدرهم الإماراتي', nameEn: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', displayOrder: 5 },
  { code: 'KWD', name: 'الدينار الكويتي', nameEn: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', displayOrder: 6 },
] as const;

export const CURRENCY_COLORS = {
  USD: '#2563EB',
  EUR: '#7C3AED',
  GBP: '#DC2626',
  SAR: '#059669',
  AED: '#D97706',
  KWD: '#7C2D12',
} as const;
