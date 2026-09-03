'use client';

import { formatPrice, formatPriceWithCurrency } from '@/lib/format';
import { CryptoPrice } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { Sparkline } from '@/components/ui/sparkline';
import { ChangeText } from '@/components/ui/change-badge';
import { LiveDot } from '@/components/ui/live-dot';

interface CryptoPriceCardProps {
  crypto: CryptoPrice;
  isHero?: boolean;
}

function LiveBadge() {
  const { language } = useLanguage();
  return (
    <div className="flex items-center gap-1.5">
      <LiveDot tone="gold" />
      <span className="text-xs font-medium text-muted">
        {language === 'ar' ? 'مباشر' : 'Live'}
      </span>
    </div>
  );
}

export function CryptoPriceCard({ crypto, isHero = false }: CryptoPriceCardProps) {
  const isPositive = crypto.change_24h >= 0;

  return (
    <div className={`card-surface transition-shadow hover:shadow-gold ${isHero ? 'md:col-span-1' : ''}`}>
      <div className={`space-y-4 ${isHero ? 'p-6' : 'p-5'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {crypto.image ? (
              <img
                src={crypto.image}
                alt={crypto.symbol}
                className="h-10 w-10 rounded-full"
                loading="lazy"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gold-soft flex items-center justify-center text-gold font-bold">
                {(crypto.symbol || crypto.name || '?').slice(0, 1)}
              </div>
            )}
            <div>
              <h3 className="font-heading text-base font-semibold text-text">
                {crypto.symbol}
              </h3>
              <p className="text-xs text-muted">{crypto.name}</p>
            </div>
          </div>
          <LiveBadge />
        </div>

        {/* Main Price (USD) */}
        <div>
          <p className="text-xs font-medium text-muted mb-1">السعر (USD)</p>
          <p className={`num font-bold text-text ${isHero ? 'text-4xl' : 'text-3xl'}`}>
            {formatPriceWithCurrency(crypto.price_usd, 'USD', 'en-US')}
          </p>
        </div>

        {/* EGP Price */}
        {crypto.price_egp && (
          <div>
            <p className="text-xs font-medium text-muted mb-0.5">السعر (EGP)</p>
            <p className="num text-lg font-medium text-muted">
              {formatPrice(crypto.price_egp)} ج.م
            </p>
          </div>
        )}

        {/* Market Cap & Volume */}
        <div className="pt-2 border-t border-line grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs font-medium text-muted block">القيمة السوقية</span>
            <span className="num text-sm font-semibold text-text">
              {(crypto.market_cap / 1_000_000_000).toFixed(2)} B
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-muted block">حجم التداول</span>
            <span className="num text-sm font-semibold text-text">
              {(crypto.volume_24h / 1_000_000_000).toFixed(2)} B
            </span>
          </div>
        </div>

        {/* Trend & Sparkline */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <ChangeText value={crypto.change_24h} />
            <span className="text-xs text-muted">24h</span>
          </div>
          {crypto.chart_points && crypto.chart_points.length > 1 && (
            <Sparkline data={crypto.chart_points} width={120} height={32} tone={isPositive ? 'up' : 'down'} />
          )}
        </div>
      </div>
    </div>
  );
}
