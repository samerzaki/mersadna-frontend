// Application constants

import { Karat, TimeRange, Country } from '@/types';

export const KARATS: Karat[] = [
  { id: 1, code: 'k24', name: 'عيار 24', purity: 1.0 },
  { id: 2, code: 'k21', name: 'عيار 21', purity: 0.875 },
  { id: 3, code: 'k18', name: 'عيار 18', purity: 0.75 },
];

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24 ساعة' },
  { value: '7d', label: '7 أيام' },
  { value: '30d', label: '30 يوم' },
  { value: '90d', label: '90 يوم' },
  { value: '1y', label: 'سنة' },
  { value: 'all', label: 'الكل' },
];

export const KARAT_COLORS = {
  k24: '#D4AF37',  // Gold
  k21: '#FFD700',  // Light gold
  k18: '#FFA500',  // Orange gold
} as const;

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

// All browser and server requests go directly to the backend. Override
// these URLs per environment rather than routing requests through the Next app.
export const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || publicApiUrl)
  : publicApiUrl;

export const REFRESH_INTERVAL = 60000; // 1 minute in milliseconds

export const COUNTRIES: Country[] = [
  {
    code: 'SO',
    name: 'Somalia',
    nameAr: 'الصومال',
    flag: '🇸🇴',
    currency: 'SOS',
  },
  {
    code: 'EG',
    name: 'Egypt',
    nameAr: 'مصر',
    flag: '🇪🇬',
    currency: 'EGP',
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    nameAr: 'السعودية',
    flag: '🇸🇦',
    currency: 'SAR',
  },
];
