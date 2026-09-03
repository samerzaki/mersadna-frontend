import { fetchNewsList } from '@/lib/api';
import { HotNewsSectionClient } from './hot-news-section';

export async function HotNewsSectionServer() {
  try {
    const response = await fetchNewsList(1);
    const news = response.data.news.slice(0, 3);

    return <HotNewsSectionClient news={news} referenceTime={new Date().toISOString()} />;
  } catch (error) {
    return (
      <section>
        <div className="card-surface p-6">
          <p className="text-[13px] text-down">
            {error instanceof Error ? error.message : 'فشل في تحميل الأخبار'}
          </p>
        </div>
      </section>
    );
  }
}

export function HotNewsSectionSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-40 bg-panel2 rounded" />
        <div className="h-4 w-24 bg-panel2 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-surface overflow-hidden">
            <div className="h-[150px] w-full bg-panel2" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-panel2 rounded" />
              <div className="h-4 w-full bg-panel2 rounded" />
              <div className="h-4 w-3/4 bg-panel2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
