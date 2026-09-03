'use client';

import { useGoldOverview } from '@/hooks/use-gold-prices';
import { useCurrencyAverages } from '@/hooks/use-currency-prices';
import { useSilverOverview } from '@/hooks/use-silver-prices';
import { useCryptoTop } from '@/hooks/use-crypto-prices';
import { formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  className?: string;
}

type TickerItem = {
  key: string;
  name: string;
  price: string;
  change?: number;
};

function TickerRow({ items }: { items: TickerItem[] }) {
  return (
    <div className="flex items-center gap-0 h-10 whitespace-nowrap flex-shrink-0" aria-hidden={false}>
      {items.map((item, i) => (
        <span
          key={item.key + i}
          className="flex items-baseline gap-2 text-[12.5px] text-dim px-[22px] border-s border-line2"
        >
          <span>{item.name}</span>
          <b className="num text-[13.5px] text-text font-medium">{item.price}</b>
          {item.change !== undefined && (
            <span className={cn('num text-[12px]', item.change >= 0 ? 'text-up' : 'text-down')}>
              {item.change >= 0 ? '↑' : '↓'} {formatPercent(Math.abs(item.change))}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export function PriceTicker({ className }: PriceTickerProps) {
  const { data: goldData } = useGoldOverview();
  const { data: usdData } = useCurrencyAverages('USD', 'EGP');
  const { data: silverData } = useSilverOverview();
  const { data: cryptoData } = useCryptoTop();

  const gold = goldData?.data?.gold;
  const usd = usdData?.data;
  const silver999 = silverData?.data?.silver?.['999_egyptian'];

  const items: TickerItem[] = [];

  (['24', '21', '18'] as const).forEach((k) => {
    const item = gold?.[k];
    if (!item) return;
    items.push({
      key: `g${k}`,
      name: `عيار ${k}`,
      price: item.sell_price.toLocaleString('en-US'),
      change: item.spread_percent,
    });
  });

  if (usd?.banks?.avg_sell_rate) {
    items.push({ key: 'usd-bank', name: 'دولار بنكي', price: usd.banks.avg_sell_rate.toFixed(2) });
  }
  if (usd?.parallel_market?.avg_sell_rate) {
    items.push({ key: 'usd-par', name: 'دولار موازي', price: usd.parallel_market.avg_sell_rate.toFixed(2) });
  }
  if (silver999) {
    items.push({
      key: 'silver',
      name: 'فضة 999',
      price: silver999.sell_price.toLocaleString('en-US'),
      change: silver999.spread_percent,
    });
  }
  (cryptoData ?? []).slice(0, 2).forEach((c) => {
    items.push({
      key: c.symbol,
      name: c.symbol,
      price: `$${c.price_usd.toLocaleString('en-US')}`,
      change: c.change_24h,
    });
  });

  if (items.length === 0) {
    return <div className={cn('h-10 border-b border-line bg-panel', className)} />;
  }

  return (
    <div className={cn('overflow-hidden border-b border-line bg-panel', className)}>
      <div className="flex w-max animate-[msTicker_80s_linear_infinite] motion-reduce:animate-none hover:[animation-play-state:paused]">
        <TickerRow items={items} />
        <TickerRow items={items} />
      </div>
    </div>
  );
}
