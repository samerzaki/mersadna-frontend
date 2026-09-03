'use client';

import GoldCalculatorPage from '@/app/gold/calculator/calculator-client';

export default function SilverCalculatorPage() {
  return (
    <GoldCalculatorPage
      defaultType="s999"
      title="حاسبة الذهب والفضة"
      lead="أدخل الوزن والعيار والمصنعية للحصول على قيمة تقديرية مبنية على السعر المرجعي المعروض."
    />
  );
}
