'use client';

import { TrendingUp, Activity, Coins, BarChart3 } from 'lucide-react';
import { CryptoMarketStats } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CryptoStatsBarProps {
  stats: CryptoMarketStats;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  subValue?: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
      <div className="h-10 w-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}</p>
        {subValue && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export function CryptoStatsBar({ stats }: CryptoStatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={TrendingUp}
        label="القيمة السوقية الإجمالية"
        value={`${(stats.total_market_cap / 1_000_000_000_000).toFixed(2)} T`}
      />
      <StatCard
        icon={Activity}
        label="حجم التداول 24 ساعة"
        value={`${(stats.total_volume_24h / 1_000_000_000).toFixed(1)} B`}
      />
      <StatCard
        icon={Coins}
        label="هيمنة البيتكوين"
        value={`${stats.btc_dominance.toFixed(1)}%`}
        subValue={`ETH: ${stats.eth_dominance.toFixed(1)}%`}
      />
      <StatCard
        icon={BarChart3}
        label="العملات النشطة"
        value={stats.active_cryptos.toLocaleString('en-US')}
        subValue={stats.markets > 0 ? `${stats.markets.toLocaleString('en-US')} أسواق` : undefined}
      />
    </div>
  );
}

export function CryptoStatsBarSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
