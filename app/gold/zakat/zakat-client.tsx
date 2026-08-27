"use client";

import React, { useState, useMemo } from "react";
import { HandHeart, Scale, CheckCircle2, Info, Trash2, Plus, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { formatPrice, formatNumber } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock live prices for calculation (EGP per gram)
const MOCK_LIVE_PRICES = {
  karat24: 3650,
  karat21: 3200,
  karat18: 2750,
  karat14: 2100,
};

// Nisab threshold: 85 grams of 24k pure gold
const NISAB_GRAMS = 85;
const ZAKAT_RATE = 0.025; // 2.5%

type KaratValue = 24 | 21 | 18 | 14;

interface GoldItem {
  id: number;
  weight: string;
  karat: KaratValue;
}

export default function GoldZakatPage() {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const [items, setItems] = useState<GoldItem[]>([{ id: 1, weight: "", karat: 24 }]);
  const [hasHawl, setHasHawl] = useState<boolean>(true);

  // Calculate pure gold weight for each item and total
  const itemsWithPureWeight = useMemo(() => {
    return items.map((item) => {
      const weightNum = parseFloat(item.weight) || 0;
      const pureWeight = weightNum > 0 ? (weightNum * item.karat) / 24 : 0;
      return { ...item, pureWeight };
    });
  }, [items]);

  const totalPureWeight = useMemo(() => {
    return itemsWithPureWeight.reduce((sum, item) => sum + item.pureWeight, 0);
  }, [itemsWithPureWeight]);

  // Calculate total value in EGP
  const totalValue = useMemo(() => {
    return itemsWithPureWeight.reduce((sum, item) => {
      const weightNum = parseFloat(item.weight) || 0;
      if (weightNum <= 0) return sum;
      const karatKey = `karat${item.karat}` as keyof typeof MOCK_LIVE_PRICES;
      return sum + weightNum * MOCK_LIVE_PRICES[karatKey];
    }, 0);
  }, [itemsWithPureWeight]);

  // Calculate total weight (for zakat in grams)
  const totalWeight = useMemo(() => {
    return itemsWithPureWeight.reduce((sum, item) => {
      const weightNum = parseFloat(item.weight) || 0;
      return sum + weightNum;
    }, 0);
  }, [itemsWithPureWeight]);

  // Check if above Nisab
  const isAboveNisab = totalPureWeight >= NISAB_GRAMS;

  // Calculate Zakat
  const zakatAmount = useMemo(() => {
    if (!isAboveNisab || !hasHawl) return 0;
    return totalValue * ZAKAT_RATE;
  }, [isAboveNisab, hasHawl, totalValue]);

  const zakatGrams = useMemo(() => {
    if (!isAboveNisab || !hasHawl) return 0;
    return totalWeight * ZAKAT_RATE;
  }, [isAboveNisab, hasHawl, totalWeight]);

  const remainingToNisab = Math.max(0, NISAB_GRAMS - totalPureWeight);
  const nisabProgress = Math.min(100, (totalPureWeight / NISAB_GRAMS) * 100);

  // Generate calculation breakdown text
  const calculationBreakdown = useMemo(() => {
    const validItems = itemsWithPureWeight.filter((item) => parseFloat(item.weight) > 0);
    if (validItems.length === 0) return null;

    const lines = validItems.map((item) => {
      const weightNum = parseFloat(item.weight);
      const pureWeight = item.pureWeight;
      return `   - ${formatNumber(parseFloat(weightNum.toFixed(2)))} جرام (عيار ${item.karat}) 🡠 تعادل ${formatNumber(parseFloat(pureWeight.toFixed(2)))} جرام (عيار 24).`;
    });

    const separator = "   " + "─".repeat(60);
    const totalLine = `   إجمالي الذهب الخالص لديك: ${formatNumber(parseFloat(totalPureWeight.toFixed(2)))} جرام (${isAboveNisab ? "أكثر من النصاب 85 جرام ✅" : "أقل من النصاب 85 جرام ❌"}).`;

    return {
      header: "تم تحويل ممتلكاتك إلى ذهب خالص (عيار 24) لتدقيق النصاب:",
      lines,
      separator,
      total: totalLine,
      totalValue: totalPureWeight,
      isAboveNisab,
    };
  }, [itemsWithPureWeight, totalPureWeight, isAboveNisab]);

  // Item management functions
  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1;
    setItems([...items, { id: newId, weight: "", karat: 24 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof GoldItem, value: string | KaratValue) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const hasValidItems = itemsWithPureWeight.some((item) => parseFloat(item.weight) > 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              
              <span>🤲</span>
              {t.pages.zakat.title}
              
            </h2>

            {/* Info Button with Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-400 transition-colors text-sm font-medium border border-primary-200 dark:border-primary-800"
                  aria-label="كيف يعمل"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>كيف يعمل</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">معلومات مهمة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 mt-4">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-700 dark:text-slate-300">النصاب:</p>
                    <p>85 جرام من الذهب الخالص (عيار 24) أو ما يعادله من العيارات الأخرى.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-700 dark:text-slate-300">نسبة الزكاة:</p>
                    <p>2.5% من إجمالي قيمة الذهب (وليس فقط الفائض عن النصاب).</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-700 dark:text-slate-300">الحول:</p>
                    <p>يجب أن يمر على الذهب عام هجري كامل (حوالي 354 يوم) منذ بلوغه النصاب.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-700 dark:text-slate-300">التحويل بين العيارات:</p>
                    <p>يتم تحويل وزن الذهب إلى عيار 24 باستخدام الصيغة: (الوزن × العيار) ÷ 24</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Top Section: Split Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 (Right): Results Section */}
        <div className="h-fit lg:order-2">
          {hasValidItems ? (
            <div className="space-y-4">
              {/* Below Nisab */}
              {!isAboveNisab && (
                <Card className="border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-fit">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Info className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                          لا تجب فيه الزكاة
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          وزن الذهب الخالص لديك ({formatNumber(parseFloat(totalPureWeight.toFixed(2)))} جرام) أقل من النصاب المطلوب ({formatNumber(NISAB_GRAMS)} جرام من الذهب الخالص).
                        </p>
                        
                        {/* Calculation Breakdown */}
                        {calculationBreakdown && (
                          <div className="mt-4 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              تفاصيل الحسبة:
                            </h4>
                            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed">
                              <p>{calculationBreakdown.header}</p>
                              {calculationBreakdown.lines.map((line, idx) => (
                                <p key={idx}>{line}</p>
                              ))}
                              <p className="text-slate-400 dark:text-slate-500">{calculationBreakdown.separator}</p>
                              <p className="font-semibold text-slate-700 dark:text-slate-300">
                                {calculationBreakdown.total}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>التقدم نحو النصاب</span>
                            <span>{formatNumber(parseFloat(nisabProgress.toFixed(1)))}%</span>
                          </div>
                          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 dark:bg-primary-600 transition-all duration-500"
                              style={{ width: `${nisabProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            تحتاج إلى {formatNumber(parseFloat(remainingToNisab.toFixed(2)))} جرام إضافية من الذهب الخالص (عيار 24) للوصول إلى النصاب
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Above Nisab but no Hawl */}
              {isAboveNisab && !hasHawl && (
                <Card className="border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 h-fit">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                          لم يمر عام هجري كامل
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-400">
                          وزن الذهب لديك ({formatNumber(parseFloat(totalPureWeight.toFixed(2)))} جرام) يبلغ النصاب، لكن يجب أن يمر عليه عام هجري كامل حتى تجب الزكاة.
                        </p>
                        
                        {/* Calculation Breakdown */}
                        {calculationBreakdown && (
                          <div className="mt-4 p-4 rounded-lg bg-white dark:bg-slate-900 border border-yellow-200 dark:border-yellow-800">
                            <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                              تفاصيل الحسبة:
                            </h4>
                            <div className="text-xs text-yellow-800 dark:text-yellow-400 space-y-1 leading-relaxed">
                              <p>{calculationBreakdown.header}</p>
                              {calculationBreakdown.lines.map((line, idx) => (
                                <p key={idx}>{line}</p>
                              ))}
                              <p className="text-yellow-600 dark:text-yellow-500">{calculationBreakdown.separator}</p>
                              <p className="font-semibold text-yellow-900 dark:text-yellow-300">
                                {calculationBreakdown.total}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Above Nisab and Hawl - Zakat Due */}
              {isAboveNisab && hasHawl && (
                <Card className="border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 h-fit">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                            تجب الزكاة
                          </h3>
                          <p className="text-sm text-green-800 dark:text-green-400 mb-4">
                            وزن الذهب الخالص لديك ({formatNumber(parseFloat(totalPureWeight.toFixed(2)))} جرام) يبلغ النصاب ومر عليه عام هجري كامل.
                          </p>
                        </div>

                        {/* Calculation Breakdown */}
                        {calculationBreakdown && (
                          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800">
                            <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
                              تفاصيل الحسبة:
                            </h4>
                            <div className="text-xs text-green-800 dark:text-green-400 space-y-1 leading-relaxed">
                              <p>{calculationBreakdown.header}</p>
                              {calculationBreakdown.lines.map((line, idx) => (
                                <p key={idx}>{line}</p>
                              ))}
                              <p className="text-green-600 dark:text-green-500">{calculationBreakdown.separator}</p>
                              <p className="font-semibold text-green-900 dark:text-green-300">
                                {calculationBreakdown.total}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Zakat Amount */}
                        <div className="space-y-3 p-4 rounded-lg bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800">
                          <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              زكاتك هي:
                            </p>
                            <div className="space-y-1">
                              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                {formatPrice(zakatAmount)}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                أو
                              </p>
                              <p className="text-xl font-semibold text-green-700 dark:text-green-400">
                                {formatNumber(parseFloat(zakatGrams.toFixed(3)))} جرام ذهب
                              </p>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                              القيمة الإجمالية: {formatPrice(totalValue)} × 2.5% = {formatPrice(zakatAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 h-fit">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <Info className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      أدخل بيانات الذهب لعرض النتيجة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Column 2 (Left): Input Section */}
        <Card className="h-fit lg:order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              <span>ممتلكاتك من الذهب</span>
            </CardTitle>
            <CardDescription>
              أدخل وزن وعيار كل قطعة ذهب تملكها
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items List */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      بند {index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        aria-label="إزالة البند"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Weight Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        الوزن (جرام)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.weight}
                        onChange={(e) => updateItem(item.id, "weight", e.target.value)}
                        placeholder="0"
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700",
                          "bg-white dark:bg-slate-900",
                          "text-slate-900 dark:text-slate-100 text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
                          "transition-all"
                        )}
                      />
                    </div>

                    {/* Karat Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        العيار
                      </label>
                      <select
                        value={item.karat}
                        onChange={(e) => updateItem(item.id, "karat", parseInt(e.target.value) as KaratValue)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700",
                          "bg-white dark:bg-slate-900",
                          "text-slate-900 dark:text-slate-100 text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
                          "transition-all"
                        )}
                      >
                        <option value={24}>عيار 24</option>
                        <option value={21}>عيار 21</option>
                        <option value={18}>عيار 18</option>
                        <option value={14}>عيار 14</option>
                      </select>
                    </div>
                  </div>

                  {/* Pure Weight Display for this item - Only show if karat is not 24 */}
                  {item.weight && parseFloat(item.weight) > 0 && item.karat !== 24 && (
                    <div className="mt-2 p-2 rounded bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-primary-900 dark:text-primary-300 font-medium">
                          يعادل (عيار 24):
                        </span>
                        <span className="text-primary-700 dark:text-primary-400 font-bold">
                          {formatNumber(
                            parseFloat(((parseFloat(item.weight) || 0) * item.karat / 24).toFixed(2))
                          )} جرام
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Item Button */}
            <button
              onClick={addItem}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                "border-2 border-dashed border-slate-300 dark:border-slate-700",
                "bg-slate-50 dark:bg-slate-800/50",
                "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20",
                "transition-all font-medium text-sm"
              )}
            >
              <Plus className="h-4 w-4" />
              <span>إضافة بند آخر</span>
            </button>

            {/* Total Pure Gold Weight Display */}
            {hasValidItems && (
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-900 dark:text-primary-300">
                    إجمالي الذهب الخالص (عيار 24)
                  </span>
                  <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
                    {formatNumber(parseFloat(totalPureWeight.toFixed(2)))} جرام
                  </span>
                </div>
              </div>
            )}

            {/* Hawl Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="hawl"
                checked={hasHawl}
                onChange={(e) => setHasHawl(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
              />
              <label htmlFor="hawl" className="flex-1 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <span className="font-medium">مرّ عليه عام هجري كامل</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  يجب أن يمر على الذهب عام هجري كامل (حوالي 354 يوم) حتى تجب الزكاة
                </p>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
