import { fetchGoldOverview } from '@/lib/api';
import { SilverWidgetClient } from './silver-widget';
import { transformSilverItem, HOMEPAGE_SILVER_KEYS, SilverDataItem } from './silver-data-utils';

export async function SilverWidgetServer() {
  try {
    const data = await fetchGoldOverview();
    const silverItems: SilverDataItem[] = [];
    const silverData = data.data?.silver;

    if (silverData) {
      for (const key of HOMEPAGE_SILVER_KEYS) {
        const value = silverData[key as keyof typeof silverData];
        if (value && typeof value === 'object' && 'price' in value) {
          silverItems.push(transformSilverItem(key, value));
        }
      }
    }

    return <SilverWidgetClient silverItems={silverItems} />;
  } catch (error) {
    return (
      <div className="card-surface p-6">
        <p className="text-[13px] text-down">
          {error instanceof Error ? error.message : 'فشل في تحميل أسعار الفضة'}
        </p>
      </div>
    );
  }
}

export function SilverWidgetSkeleton() {
  return (
    <div className="card-surface overflow-hidden animate-pulse">
      <div className="card-header-row">
        <div className="h-4 w-16 bg-panel2 rounded" />
      </div>
      <div className="divide-y divide-line2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5">
            <div className="h-4 w-24 bg-panel2 rounded" />
            <div className="h-4 w-16 bg-panel2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
