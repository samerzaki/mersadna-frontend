'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoldCalculator } from '@/hooks/use-gold-prices';
import { formatPrice } from '@/lib/format';
import { Scale } from 'lucide-react';

export function GoldCalculator() {
  const [weight, setWeight] = useState<string>('5');
  const [selectedKarat, setSelectedKarat] = useState<18 | 21 | 24>(21);

  const weightNum = parseFloat(weight) || 0;

  // Use real-time calculator API
  const { data: calculation, isLoading } = useGoldCalculator(
    weightNum,
    selectedKarat,
    weightNum > 0
  );

  const totalValue = calculation?.data?.total_value || 0;
  const pricePerGram = calculation?.data?.price_per_gram || 0;

  return (
    <Card className="bg-gradient-to-br from-gold-50/50 to-transparent dark:from-gold-950/20 border-gold-200/30 dark:border-gold-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="h-5 w-5 text-gold-600" />
          ⚖️ حاسبة الذهب السريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Input Row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                الوزن (جرام)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="5"
                min="0"
                step="0.1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                العيار
              </label>
              <select
                value={selectedKarat}
                onChange={(e) => setSelectedKarat(Number(e.target.value) as 18 | 21 | 24)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value={24}>عيار 24</option>
                <option value={21}>عيار 21</option>
                <option value={18}>عيار 18</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="pt-3 border-t border-gold-200/30 dark:border-gold-800/30">
            <p className="text-xs text-muted-foreground mb-2">💰 القيمة التقديرية</p>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">جاري الحساب...</div>
            ) : (
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-gold-700 dark:text-gold-400">
                      {formatPrice(totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">القيمة الإجمالية</p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-muted-foreground">
                      {formatPrice(pricePerGram)}
                    </p>
                    <p className="text-xs text-muted-foreground">سعر الجرام</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
