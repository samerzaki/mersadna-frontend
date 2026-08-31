import { fetchCryptoTop, fetchCryptoList } from '@/lib/api';
import { adaptCryptoTopItem, adaptCryptoApiItem, adaptCryptoPagination } from '@/lib/crypto-adapters';
import { CryptoPageClient } from './crypto-client';
import { Skeleton } from '@/components/ui/skeleton';
import { CryptoMarketTableSkeleton } from '@/components/crypto/crypto-market-table';
import type { CryptoPrice, CryptoPaginatedResult } from '@/types';

export interface CryptoInitialData {
  topCryptos: CryptoPrice[];
  initialList: CryptoPaginatedResult;
}

export async function CryptoPageServer() {
  try {
    const [topRes, listRes] = await Promise.all([
      fetchCryptoTop(),
      fetchCryptoList(1, 20),
    ]);

    const initialData: CryptoInitialData = {
      topCryptos: topRes.data.map(adaptCryptoTopItem),
      initialList: {
        cryptos: listRes.data.map(adaptCryptoApiItem),
        pagination: adaptCryptoPagination(listRes.pagination),
      },
    };

    return <CryptoPageClient initialData={initialData} />;
  } catch (error) {
    // Fall back to client-side fetching on error
    return <CryptoPageClient initialData={null} />;
  }
}

export function CryptoPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <CryptoMarketTableSkeleton />
        </div>
      </div>
    </div>
  );
}
