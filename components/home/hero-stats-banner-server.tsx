import { fetchGoldOverview, fetchHighestBuyPrice, fetchHighestSellPrice } from '@/lib/api';
import { isPriceLive } from '@/lib/format';
import { HeroStatsBannerClient } from './hero-stats-banner';
import { Skeleton } from '@/components/ui/skeleton';

export interface HeroStatsBannerData {
  gold24: { sell_price: number; spread_percent: number; is_live: boolean } | null;
  gold21: { sell_price: number; spread_percent: number; is_live: boolean } | null;
  gold18: { sell_price: number; spread_percent: number; is_live: boolean } | null;
  ounce: { sell_price: number; is_live: boolean } | null;
  usdBuy: {
    price: string;
    bank: {
      name: string;
      bank_logo_url: string;
    } | null;
  } | null;
  usdSell: {
    price: string;
    bank: {
      name: string;
      bank_logo_url: string;
    } | null;
  } | null;
}

export async function HeroStatsBannerServer() {
  try {
    const [goldData, usdBuyData, usdSellData] = await Promise.all([
      fetchGoldOverview(),
      fetchHighestBuyPrice('USD'),
      fetchHighestSellPrice('USD'),
    ]);

    const gold = goldData?.data?.gold;

    const bannerData: HeroStatsBannerData = {
      gold24: gold?.['24'] ? {
        sell_price: gold['24'].sell_price,
        spread_percent: gold['24'].spread_percent,
        is_live: isPriceLive(gold['24'].recorded_at),
      } : null,
      gold21: gold?.['21'] ? {
        sell_price: gold['21'].sell_price,
        spread_percent: gold['21'].spread_percent,
        is_live: isPriceLive(gold['21'].recorded_at),
      } : null,
      gold18: gold?.['18'] ? {
        sell_price: gold['18'].sell_price,
        spread_percent: gold['18'].spread_percent,
        is_live: isPriceLive(gold['18'].recorded_at),
      } : null,
      ounce: gold?.ounce ? {
        sell_price: gold.ounce.sell_price,
        is_live: isPriceLive(gold.ounce.recorded_at),
      } : null,
      usdBuy: usdBuyData?.data ? {
        price: usdBuyData.data.price,
        bank: usdBuyData.data.bank ? {
          name: usdBuyData.data.bank.name,
          bank_logo_url: usdBuyData.data.bank.bank_logo_url,
        } : null,
      } : null,
      usdSell: usdSellData?.data ? {
        price: usdSellData.data.price,
        bank: usdSellData.data.bank ? {
          name: usdSellData.data.bank.name,
          bank_logo_url: usdSellData.data.bank.bank_logo_url,
        } : null,
      } : null,
    };

    return <HeroStatsBannerClient data={bannerData} />;
  } catch {
    // On error, render nothing for the banner (non-critical UI)
    return null;
  }
}

export function HeroStatsBannerSkeleton() {
  return (
    <div className="md:sticky md:top-16 md:z-40 bg-linear-to-r from-primary-500/10 via-primary-400/5 to-transparent border-b border-primary-200/20 dark:border-primary-800/20 backdrop-blur-sm">
      <div className="px-4 md:px-8 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-36 shrink-0" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
