import { AlertCircle } from 'lucide-react';
import { fetchCurrencyAverages, fetchHighestBuyPrice, fetchCurrencyBanks, fetchBlackMarketRates } from '@/lib/api';
import { UnifiedDashboard } from './unified-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export interface CurrencyDashboardInitialData {
  averages: {
    banks: { avg_buy_rate: number; avg_sell_rate: number; count: number } | null;
    parallel_market: { avg_buy_rate: number; avg_sell_rate: number; count: number } | null;
  } | null;
  highestBuy: {
    price: string;
    bank: { name: string; bank_logo_url: string } | null;
  } | null;
  bankRates: {
    banks: Array<{
      id: number;
      code: string;
      name: string;
      bank_logo_url: string;
      latest_buy_rate: number;
      latest_sell_rate: number;
      chart: { data: Array<{ buy_rate: number }> };
    }>;
  } | null;
  blackMarket: {
    rates: Array<{ currency: string; buy_rate: number; sell_rate: number; mid_rate: number; last_updated: string }>;
    last_update_at: string;
    source_arabic_name: string;
  } | null;
}

function bankDisplayName(bank: { name?: unknown; arabic_name?: unknown; english_name?: unknown }): string {
  if (typeof bank.arabic_name === 'string') return bank.arabic_name;
  if (typeof bank.name === 'string') return bank.name;
  if (bank.name && typeof bank.name === 'object') {
    const localizedName = bank.name as { ar?: unknown; en?: unknown };
    if (typeof localizedName.ar === 'string') return localizedName.ar;
    if (typeof localizedName.en === 'string') return localizedName.en;
  }
  if (typeof bank.english_name === 'string') return bank.english_name;
  return '—';
}

export async function UnifiedDashboardServer() {
  try {
    const [avgRes, buyRes, banksRes, blackMarketRes] = await Promise.all([
      fetchCurrencyAverages('USD', 'EGP'),
      fetchHighestBuyPrice('USD'),
      fetchCurrencyBanks('USD', 'EGP', '24h'),
      fetchBlackMarketRates(undefined, 'EGP'),
    ]);

    const initialData: CurrencyDashboardInitialData = {
      averages: avgRes.data ? {
        banks: avgRes.data.banks ?? null,
        parallel_market: avgRes.data.parallel_market ?? null,
      } : null,
      highestBuy: buyRes.data ? {
        price: buyRes.data.price,
        bank: buyRes.data.bank ? {
          name: bankDisplayName(buyRes.data.bank),
          bank_logo_url: buyRes.data.bank.bank_logo_url,
        } : null,
      } : null,
      bankRates: banksRes.success && banksRes.data?.banks ? {
        banks: banksRes.data.banks.map(bank => ({
          id: bank.id,
          code: bank.code,
          name: bankDisplayName(bank),
          bank_logo_url: bank.bank_logo_url,
          latest_buy_rate: bank.price.buy,
          latest_sell_rate: bank.price.sell,
          chart: { data: bank.chart.data.map(d => ({ buy_rate: d.buy_rate })) },
        })),
      } : null,
      blackMarket: blackMarketRes.success && blackMarketRes.data ? {
        rates: blackMarketRes.data.rates,
        last_update_at: blackMarketRes.data.last_update_at,
        source_arabic_name: blackMarketRes.data.source_arabic_name,
      } : null,
    };

    return <UnifiedDashboard initialData={initialData} />;
  } catch (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {error instanceof Error ? error.message : 'فشل في تحميل أسعار العملات'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export function UnifiedDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
