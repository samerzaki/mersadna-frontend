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

function formatTickerPrice(value: unknown): string | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toLocaleString('en-US')
    : null;
}

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
    // The source can temporarily omit a quote while it is being refreshed.
    // Do not let one incomplete record take down the global ticker.
    const sellPrice = formatTickerPrice(item?.price?.sell);
    if (!item || sellPrice === null) return;
    items.push({
      key: `g${k}`,
      name: `عيار ${k}`,
      price: sellPrice,
      change: typeof item.change?.percent === 'number' ? item.change.percent : undefined,
    });
  });

  if (usd?.banks?.avg_sell_rate) {
    items.push({ key: 'usd-bank', name: 'دولار بنكي', price: usd.banks.avg_sell_rate.toFixed(2) });
  }
  if (usd?.parallel_market?.avg_sell_rate) {
    items.push({ key: 'usd-par', name: 'دولار موازي', price: usd.parallel_market.avg_sell_rate.toFixed(2) });
  }
  const silverPrice = formatTickerPrice(silver999?.price?.sell);
  if (silver999 && silverPrice !== null) {
    items.push({
      key: 'silver',
      name: 'فضة 999',
      price: silverPrice,
      change: typeof silver999.change?.percent === 'number' ? silver999.change.percent : undefined,
    });
  }
  (cryptoData ?? []).slice(0, 2).forEach((c) => {
    const cryptoPrice = formatTickerPrice(c.price_usd);
    if (cryptoPrice === null) return;
    items.push({
      key: c.symbol,
      name: c.symbol,
      price: `$${cryptoPrice}`,
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
