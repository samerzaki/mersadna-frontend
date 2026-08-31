import { AlertCircle } from 'lucide-react';
import { fetchNewsList } from '@/lib/api';
import { HotNewsSectionClient } from './hot-news-section';
import { Skeleton } from '@/components/ui/skeleton';

export async function HotNewsSectionServer() {
  try {
    const response = await fetchNewsList(undefined, 1);
    const news = response.data.news.slice(0, 4);

    return <HotNewsSectionClient news={news} referenceTime={new Date().toISOString()} />;
  } catch (error) {
    return (
      <section>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300">
                خطأ في تحميل البيانات
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                {error instanceof Error ? error.message : 'فشل في تحميل الأخبار'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export function HotNewsSectionSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-36" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Skeleton className="aspect-[16/9] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
