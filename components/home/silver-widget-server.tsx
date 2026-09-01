import { AlertCircle } from 'lucide-react';
import { fetchSilverOverview } from '@/lib/api';
import { SilverWidgetClient } from './silver-widget';
import { transformSilverItem, HOMEPAGE_SILVER_KEYS, SilverDataItem } from './silver-data-utils';
import { Skeleton } from '@/components/ui/skeleton';

export async function SilverWidgetServer() {
  try {
    const data = await fetchSilverOverview();
    const silverItems: SilverDataItem[] = [];
    const silverData = data.data?.silver;

    if (silverData) {
      for (const key of HOMEPAGE_SILVER_KEYS) {
        const value = silverData[key as keyof typeof silverData];
        if (value && typeof value === 'object' && 'sell_price' in value) {
          silverItems.push(transformSilverItem(key, value));
        }
      }
    }

    return <SilverWidgetClient silverItems={silverItems} />;
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
                {error instanceof Error ? error.message : 'فشل في تحميل أسعار الفضة'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export function SilverWidgetSkeleton() {
  return (
    <section className="flex flex-col w-full">
      <div className="mb-4"><Skeleton className="h-8 w-36" /></div>
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-border dark:bg-card">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2 dark:border-border dark:bg-secondary"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-10" /></div>
        <div className="divide-y divide-slate-100 dark:divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="ms-4 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
              <div className="me-4 space-y-2"><Skeleton className="ms-auto h-5 w-20" /><Skeleton className="ms-auto h-3 w-10" /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
