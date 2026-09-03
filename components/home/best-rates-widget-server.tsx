import { fetchHighestBuyPrice, fetchHighestSellPrice, fetchCurrencyAverages } from '@/lib/api';
import { BestRatesWidgetClient } from './best-rates-widget';

export interface BestRatesBank {
  id: number;
  code: string;
  name: string;
  bank_logo_url: string;
}

export interface BestRatesInitialData {
  highestBuy: { price: string; bank: BestRatesBank } | null;
  highestSell: { price: string; bank: BestRatesBank } | null;
  averages: {
    banks: { avg_buy_rate: number; avg_sell_rate: number; count: number };
    parallel_market: { avg_buy_rate: number; avg_sell_rate: number; count: number };
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
      highestBuy: buyRes.data ? { price: buyRes.data.price, bank: buyRes.data.bank } : null,
      highestSell: sellRes.data ? { price: sellRes.data.price, bank: sellRes.data.bank } : null,
      averages: avgRes.data
        ? { banks: avgRes.data.banks, parallel_market: avgRes.data.parallel_market }
        : null,
    };

    return <BestRatesWidgetClient initialData={initialData} />;
  } catch (error) {
    return (
      <section>
        <div className="card-surface p-6">
          <p className="text-[13px] text-down">
            {error instanceof Error ? error.message : 'فشل في تحميل أسعار العملات'}
          </p>
        </div>
      </section>
    );
  }
}

export function BestRatesWidgetSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-56 bg-panel2 rounded" />
        <div className="h-10 w-64 bg-panel2 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-panel2 rounded-2xl" />
        ))}
      </div>
    </section>
  );
}
