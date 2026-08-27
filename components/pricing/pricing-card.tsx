import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FeatureItem } from './feature-item';

interface Feature {
  text: string;
  included?: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: Feature[];
  isPremium?: boolean;
  ctaText: string;
  onCtaClick?: () => void;
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  isPremium = false,
  ctaText,
  onCtaClick
}: PricingCardProps) {
  return (
    <Card className={cn(
      'overflow-hidden',
      isPremium && 'border-primary'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            {title}
          </CardTitle>
          {isPremium && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              PRO
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tabular-nums">
            {price}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {period}
          </span>
        </div>

        <ul className="space-y-0">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              text={feature.text}
              included={feature.included}
            />
          ))}
        </ul>

        <Button
          variant={isPremium ? 'default' : 'outline'}
          className="w-full"
          size="sm"
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}
