'use client';

import { useState } from 'react';
import { CryptoPriceCard } from '@/components/crypto/crypto-price-card';
import { CryptoMarketTable, CryptoMarketTableSkeleton } from '@/components/crypto/crypto-market-table';
import { useCryptoPrices, useCryptoTop } from '@/hooks/use-crypto-prices';
import { useLanguage } from '@/contexts/language-context';
import { AlertCircle } from 'lucide-react';
import type { CryptoInitialData } from './crypto-featured-server';

interface CryptoPageClientProps {
  initialData: CryptoInitialData | null;
}

export function CryptoPageClient({ initialData }: CryptoPageClientProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [page, setPage] = useState(1);

  const hasInitialData = !!initialData;
  const isFirstPage = page === 1;

  // React Query hooks always run — they'll fill the cache for refresh
  const { data: listData, isLoading: listLoading, error: listError } = useCryptoPrices(page);
  const { data: topCryptos, isLoading: topLoading, error: topError } = useCryptoTop();

  // Use initial data as fallback until client hooks resolve
  const effectiveTopCryptos = topCryptos ?? (hasInitialData ? initialData.topCryptos : undefined);
  const effectiveListData = listData ?? (hasInitialData && isFirstPage ? initialData.initialList : undefined);
  const effectiveListLoading = effectiveListData ? false : listLoading;
  const effectiveTopLoading = effectiveTopCryptos ? false : topLoading;

  const isInitialLoading = effectiveListLoading && effectiveTopLoading;
  const error = listError || topError;

  if (isInitialLoading) {
    return <LoadingState />;
  }

  if (error && !effectiveListData && !effectiveTopCryptos?.length) {
    return <ErrorState message={error instanceof Error ? error.message : 'Failed to load crypto data'} isRTL={isRTL} />;
  }

  return (
    <div className="space-y-8">
      {/* Featured Cryptos (Top 3) */}
      {effectiveTopCryptos && effectiveTopCryptos.length > 0 && (
        <section>
          <h2 className="font-heading text-xl font-bold text-text mb-4">
            {isRTL ? 'العملات المميزة' : 'Featured Cryptocurrencies'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {effectiveTopCryptos.map((crypto) => (
              <CryptoPriceCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        </section>
      )}

      {/* Market Overview Table */}
      <section>
        {effectiveListLoading && !effectiveListData ? (
          <CryptoMarketTableSkeleton />
        ) : (
          <CryptoMarketTable
            cryptos={effectiveListData?.cryptos ?? []}
            pagination={effectiveListData?.pagination}
            onPageChange={setPage}
            isLoading={listLoading}
          />
        )}
      </section>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-48 mb-4 bg-panel2 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-panel2 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-panel2 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-panel2 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="h-10 w-32 bg-panel2 rounded animate-pulse" />
                <div className="h-8 w-24 bg-panel2 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <CryptoMarketTableSkeleton />
    </div>
  );
}

function ErrorState({ message, isRTL }: { message: string; isRTL: boolean }) {
  return (
    <div className="card-surface p-6 border border-down/20">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-down" />
        <div>
          <h3 className="font-semibold text-text">
            {isRTL ? 'خطأ في تحميل البيانات' : 'Error loading data'}
          </h3>
          <p className="text-sm text-muted">{message}</p>
        </div>
      </div>
    </div>
  );
}
