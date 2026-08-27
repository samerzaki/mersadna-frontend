import { AlertCircle } from 'lucide-react';
import { fetchCryptoTop } from '@/lib/api';
import { adaptCryptoTopItem } from '@/lib/crypto-adapters';
import { CryptoWidgetClient } from './crypto-widget';
import { Skeleton } from '@/components/ui/skeleton';

export async function CryptoWidgetServer() {
  try {
    const response = await fetchCryptoTop();
    const cryptos = response.data.map(adaptCryptoTopItem);

    return <CryptoWidgetClient cryptos={cryptos} />;
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
                {error instanceof Error ? error.message : 'فشل في تحميل أسعار العملات الرقمية'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export function CryptoWidgetSkeleton() {
  return (
    <section className="flex flex-col w-full">
      <div className="mb-4">
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-slate-100 dark:border-border overflow-hidden flex-1 flex flex-col">
        <div className="px-4 py-1.5 border-b border-slate-100 dark:border-border">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-border flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
