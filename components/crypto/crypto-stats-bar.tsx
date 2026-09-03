'use client';

import { TrendingUp, Activity, Coins, BarChart3 } from 'lucide-react';
import { CryptoMarketStats } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { StatTile } from '@/components/ui/stat-tile';

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
    <StatTile
      label={
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gold" />
          {label}
        </span>
      }
      value={value}
      sub={subValue && <span className="text-[12px] text-dim">{subValue}</span>}
    />
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
        <div key={i} className="stat-tile">
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
