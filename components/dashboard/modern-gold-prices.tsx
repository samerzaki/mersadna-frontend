'use client';

import { GoldPriceTable } from '@/components/gold/gold-price-table';
import type { ModernGoldDataItem } from './modern-gold-prices-server';

interface ModernGoldPricesClientProps {
  goldData: ModernGoldDataItem[];
  referenceTime: string;
}

export function ModernGoldPricesClient({ goldData }: ModernGoldPricesClientProps) {
  return <GoldPriceTable goldData={goldData} />;
}
