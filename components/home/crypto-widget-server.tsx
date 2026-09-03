import { fetchCryptoList } from '@/lib/api';
import { adaptCryptoApiItem } from '@/lib/crypto-adapters';
import { CryptoWidgetClient } from './crypto-widget';

export async function CryptoWidgetServer() {
  try {
    const response = await fetchCryptoList(1, 4);
    const cryptos = response.data.map(adaptCryptoApiItem);

    return <CryptoWidgetClient cryptos={cryptos} />;
  } catch (error) {
    return (
      <div className="card-surface p-6">
        <p className="text-[13px] text-down">
          {error instanceof Error ? error.message : 'فشل في تحميل أسعار العملات الرقمية'}
        </p>
      </div>
    );
  }
}

export function CryptoWidgetSkeleton() {
  return (
    <div className="card-surface overflow-hidden animate-pulse">
      <div className="card-header-row">
        <div className="h-4 w-24 bg-panel2 rounded" />
      </div>
      <div className="divide-y divide-line2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5">
            <div className="h-4 w-20 bg-panel2 rounded" />
            <div className="h-4 w-16 bg-panel2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
