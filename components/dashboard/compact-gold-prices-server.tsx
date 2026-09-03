import { AlertCircle } from 'lucide-react';
import { fetchGoldOverview } from '@/lib/api';
import { CompactGoldCard } from './compact-gold-card-client';
import { transformApiDataToGoldDataItem, GoldDataItem } from './gold-data-utils';

/**
 * Server component for gold prices
 * Fetches data on the server and passes to client components
 * No JSON API calls visible in browser network tab
 */
export async function CompactGoldPricesServer() {
  try {
    // Fetch data on the server
    const data = await fetchGoldOverview();

    // Transform API data to display format
    const goldData: GoldDataItem[] = [];

    if (data.data?.gold) {
      const { last_checked_at, last_checked_at_for_human } = data.data.gold;
      Object.entries(data.data.gold).forEach(([key, value]) => {
        if (value && typeof value === 'object' && 'sell_price' in value) {
          goldData.push(transformApiDataToGoldDataItem(key, value, last_checked_at, last_checked_at_for_human));
        }
      });
    }

    // Find items by ID
    const findItem = (id: string) => goldData.find((item) => item.id === id);

    // Order: 21k, gold pound, 24k, 18k, ounce
    const orderedItems = [
      findItem('k21'),
      findItem('pound'),
      findItem('k24'),
      findItem('k18'),
      findItem('ounce'),
    ].filter(Boolean) as GoldDataItem[];

    // Render cards (passed to client components for interactivity)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {orderedItems.map((item) => (
          <CompactGoldCard key={item.id} item={item} />
        ))}
      </div>
    );
  } catch (error) {
    // Error handling - show user-friendly error message
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {error instanceof Error ? error.message : 'فشل في تحميل أسعار الذهب'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Loading skeleton for server component
 * Used in Suspense fallback
 */
export function CompactGoldPricesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm p-4 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
