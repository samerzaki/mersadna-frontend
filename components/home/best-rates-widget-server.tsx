import { AlertCircle } from 'lucide-react';
import { fetchHighestBuyPrice, fetchHighestSellPrice, fetchCurrencyAverages } from '@/lib/api';
import { BestRatesWidgetClient } from './best-rates-widget';
import { Skeleton } from '@/components/ui/skeleton';

export interface BestRatesInitialData {
  highestBuy: {
    price: string;
    from_currency: string;
    to_currency: string;
    bank: {
      id: number;
      code: string;
      name: string;
      english_name: string;
      arabic_name: string;
      bank_logo_url: string;
    };
  } | null;
  highestSell: {
    price: string;
    from_currency: string;
    to_currency: string;
    bank: {
      id: number;
      code: string;
      name: string;
      english_name: string;
      arabic_name: string;
      bank_logo_url: string;
    };
  } | null;
  parallelMarket: {
    avg_buy_rate: number;
    avg_sell_rate: number;
    count: number;
  } | null;
}

export async function BestRatesWidgetServer() {
  try {
    const [buyRes, sellRes, avgRes] = await Promise.all([
      fetchHighestBuyPrice('USD'),
      fetchHighestSellPrice('USD'),
      fetchCurrencyAverages('USD', 'EGP'),
    ]);

    const initialData: BestRatesInitialData = {
      highestBuy: buyRes.data ?? null,
      highestSell: sellRes.data ?? null,
      parallelMarket: avgRes.data?.parallel_market ?? null,
    };

    return <BestRatesWidgetClient initialData={initialData} />;
  } catch (error) {
    return (
      <section className="flex flex-col w-full">
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
      </section>
    );
  }
}

export function BestRatesWidgetSkeleton() {
  return (
    <section className="flex flex-col w-full">
      <div className="mb-4">
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-slate-100 dark:border-border overflow-hidden flex-1">
        <div className="px-4 py-1.5 border-b border-slate-100 dark:border-border">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-100 dark:divide-border">
          {[1, 2].map((col) => (
            <div key={col}>
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-border">
                <Skeleton className="h-5 w-28 mx-auto" />
              </div>
              <div className="px-4 py-3 border-b border-slate-100 dark:border-border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
