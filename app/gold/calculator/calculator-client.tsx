"use client";

import { useState, useEffect, useMemo } from "react";
import { Calculator, TrendingUp, DollarSign, Coins, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useGoldOverview } from "@/hooks/use-gold-prices";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SimpleCalculator, type MetalType } from "@/components/calculator/simple-calculator";
import { WORKMANSHIP_RANGES } from "@/lib/constants";

// Type definitions for all tabs
type PLItem = {
  id: string;
  buyPrice: string;
  weight: string;
  workmanship: string;
  karat: "karat24" | "karat21" | "karat18";
};

type SellItem = {
  id: string;
  weight: string;
  karat: "karat24" | "karat21" | "karat18";
  dealerDeduction: string;
  cashback: string;
};

type BuyItem = {
  id: string;
  weight: string;
  karat: "karat24" | "karat21" | "karat18";
  customWorkmanship: string;
};

interface GoldCalculatorPageProps {
  defaultType?: MetalType;
  title?: string;
  lead?: string;
}

export default function GoldCalculatorPage({
  defaultType = 'g21',
  title,
  lead,
}: GoldCalculatorPageProps = {}) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const effectiveTitle = title ?? t.pages.calculator.defaultTitle;
  const effectiveLead = lead ?? t.pages.calculator.defaultLead;
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');

  // Fetch real gold prices from API
  const { data: goldData, isLoading: goldLoading, error: goldError } = useGoldOverview();

  // `buy` is what the goldsmith pays the customer; `sell` is what the
  // customer pays the goldsmith. Keep both rates for the relevant action.
  const LIVE_PRICES = {
    karat24: goldData?.data?.gold?.['24']?.price.buy || 0,
    karat21: goldData?.data?.gold?.['21']?.price.buy || 0,
    karat18: goldData?.data?.gold?.['18']?.price.buy || 0,
  };
  const PURCHASE_PRICES = useMemo(() => ({
    karat24: goldData?.data?.gold?.['24']?.price.sell || 0,
    karat21: goldData?.data?.gold?.['21']?.price.sell || 0,
    karat18: goldData?.data?.gold?.['18']?.price.sell || 0,
  }), [goldData]);

  // Tab 1: P&L Calculator State (Refactored)
  const [plItems, setPlItems] = useState<PLItem[]>([
    { id: "1", buyPrice: "", weight: "", workmanship: "", karat: "karat21" }
  ]);

  // Tab 2: Sell Calculator State (Refactored)
  const [sellItems, setSellItems] = useState<SellItem[]>([
    { id: "1", weight: "", karat: "karat21", dealerDeduction: "", cashback: "" }
  ]);

  // Tab 3: Buy Calculator State (Refactored)
  const [buyItems, setBuyItems] = useState<BuyItem[]>([
    { id: "1", weight: "", karat: "karat21", customWorkmanship: "" }
  ]);

  // Auto-fill buy price when karat changes or prices load
  useEffect(() => {
    if (PURCHASE_PRICES.karat21 > 0 && PURCHASE_PRICES.karat24 > 0 && PURCHASE_PRICES.karat18 > 0) {
      setPlItems((items) =>
        items.map((item) => ({
          ...item,
          buyPrice: PURCHASE_PRICES[item.karat].toString(),
        }))
      );
    }
  }, [PURCHASE_PRICES]);

  // P&L Item Management
  const addPLItem = () => {
    const newId = (plItems.length + 1).toString();
    const defaultKarat = "karat21";
    setPlItems([
      ...plItems,
      {
        id: newId,
        buyPrice: PURCHASE_PRICES[defaultKarat].toString(),
        weight: "",
        workmanship: "",
        karat: defaultKarat,
      },
    ]);
  };

  const removePLItem = (id: string) => {
    if (plItems.length > 1) {
      setPlItems(plItems.filter((item) => item.id !== id));
    }
  };

  const updatePLItem = (id: string, field: keyof PLItem, value: string) => {
    setPlItems(
      plItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Auto-update buyPrice when karat changes
          if (field === "karat") {
            updatedItem.buyPrice = PURCHASE_PRICES[value as "karat24" | "karat21" | "karat18"].toString();
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Sell Item Management
  const addSellItem = () => {
    const newId = (sellItems.length + 1).toString();
    setSellItems([...sellItems, { id: newId, weight: "", karat: "karat21", dealerDeduction: "", cashback: "" }]);
  };

  const removeSellItem = (id: string) => {
    if (sellItems.length > 1) {
      setSellItems(sellItems.filter((item) => item.id !== id));
    }
  };

  const updateSellItem = (id: string, field: keyof SellItem, value: string) => {
    setSellItems(sellItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Buy Item Management
  const addBuyItem = () => {
    const newId = (buyItems.length + 1).toString();
    setBuyItems([...buyItems, { id: newId, weight: "", karat: "karat21", customWorkmanship: "" }]);
  };

  const removeBuyItem = (id: string) => {
    if (buyItems.length > 1) {
      setBuyItems(buyItems.filter((item) => item.id !== id));
    }
  };

  const updateBuyItem = (id: string, field: keyof BuyItem, value: string) => {
    setBuyItems(buyItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // P&L Calculations
  const calculatePL = () => {
    let totalCost = 0;
    let totalCurrentValue = 0;

    plItems.forEach((item) => {
      const buyPrice = parseFloat(item.buyPrice) || 0;
      const weight = parseFloat(item.weight) || 0;
      const workmanship = parseFloat(item.workmanship) || 0;
      const livePrice = LIVE_PRICES[item.karat];

      totalCost += weight * (buyPrice + workmanship);
      totalCurrentValue += weight * livePrice;
    });

    const difference = totalCurrentValue - totalCost;
    const percentageChange = totalCost > 0 ? (difference / totalCost) * 100 : 0;

    return {
      totalCost,
      totalCurrentValue,
      difference,
      percentageChange,
      isProfit: difference >= 0,
    };
  };

  // Sell Calculations
  const calculateSell = () => {
    let totalCash = 0;
    let totalMarketValue = 0;

    sellItems.forEach((item) => {
      const weight = parseFloat(item.weight) || 0;
      const livePrice = LIVE_PRICES[item.karat];
      const dealerDeduction = parseFloat(item.dealerDeduction) || 0;
      const cashback = parseFloat(item.cashback) || 0;

      const marketValue = weight * livePrice;
      const itemValue = weight * (livePrice - dealerDeduction) + cashback;

      totalMarketValue += marketValue;
      totalCash += itemValue;
    });

    return {
      totalMarketValue,
      totalCash,
      totalDeduction: totalMarketValue - totalCash,
    };
  };

  // Buy Calculations
  const calculateBuy = () => {
    let totalCost = 0;
    let totalBasePrice = 0;
    let totalWorkmanship = 0;

    buyItems.forEach((item) => {
      const weight = parseFloat(item.weight) || 0;
      const livePrice = PURCHASE_PRICES[item.karat];
      const customWork = parseFloat(item.customWorkmanship);
      const workmanship = !isNaN(customWork) && customWork >= 0
        ? customWork
        : WORKMANSHIP_RANGES[item.karat].default;

      const basePrice = weight * livePrice;
      const workmanshipCost = weight * workmanship;

      totalBasePrice += basePrice;
      totalWorkmanship += workmanshipCost;
      totalCost += basePrice + workmanshipCost;
    });

    return {
      totalBasePrice,
      totalWorkmanship,
      totalCost,
    };
  };

  const plResults = calculatePL();
  const sellResults = calculateSell();
  const buyResults = calculateBuy();

  // Show loading state
  if (goldLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
          <p className="text-sm text-slate-500">{t.pages.calculator.loadingPrices}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (goldError || !goldData) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-red-900">{t.pages.calculator.errorTitle}</h3>
              <p className="text-sm text-red-700">
                {goldError instanceof Error ? goldError.message : t.pages.calculator.errorMessage}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8" dir={dir}>
      <PageHeader eyebrow={isRTL ? 'الأدوات' : 'Tools'} title={effectiveTitle} lead={effectiveLead} />

      <SegmentedControl
        items={[
          { value: 'simple', label: t.pages.calculator.viewSimple },
          { value: 'advanced', label: t.pages.calculator.viewAdvanced },
        ]}
        value={viewMode}
        onChange={(v) => setViewMode(v as 'simple' | 'advanced')}
      />

      {viewMode === 'simple' && <SimpleCalculator defaultType={defaultType} />}

      {viewMode === 'advanced' && (
      <div className="max-w-7xl mx-auto">
      {/* Split Layout: Desktop Grid / Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* INPUTS: First in DOM (Top on Mobile / Right on Desktop RTL) */}
        <div className="lg:col-span-9 pb-32 lg:pb-0">
          <Tabs dir={dir} defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="buy" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">{t.pages.calculator.workmanshipCalculator}</span>
                <span className="sm:hidden">{t.pages.calculator.workmanshipShort}</span>
              </TabsTrigger>
              <TabsTrigger value="sell" className="gap-2">
                <Coins className="h-4 w-4" />
                <span className="hidden sm:inline">{t.pages.calculator.sellCalculator}</span>
                <span className="sm:hidden">{t.pages.calculator.sellShort}</span>
              </TabsTrigger>
              <TabsTrigger value="pl" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t.pages.calculator.plCalculator}</span>
                <span className="sm:hidden">{t.pages.calculator.profitShort}</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content - Buy Calculator (حاسبة المصنعية) */}
            <TabsContent value="buy" className="mt-0 space-y-4">
              {buyItems.map((item, index) => (
                <Card key={item.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.pages.calculator.item} {index + 1}
                      </CardTitle>
                      {buyItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeBuyItem(item.id)}
                          className="h-7 w-7 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.karat}
                        </Label>
                        <Select
                          dir={dir}
                          value={item.karat}
                          onValueChange={(value) => updateBuyItem(item.id, "karat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="karat24">
                              24K - {LIVE_PRICES.karat24.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                            <SelectItem value="karat21">
                              21K - {LIVE_PRICES.karat21.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                            <SelectItem value="karat18">
                              18K - {LIVE_PRICES.karat18.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.weightGram}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) => updateBuyItem(item.id, "weight", e.target.value)}
                          placeholder="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.workmanshipPerGramOptional}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.customWorkmanship}
                          onChange={(e) => updateBuyItem(item.id, "customWorkmanship", e.target.value)}
                          placeholder={t.pages.calculator.autoIfEmpty}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addBuyItem}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                {t.pages.calculator.addAnotherItem}
              </Button>
            </TabsContent>

            {/* Tab Content - Sell Calculator (حاسبة البيع) */}
            <TabsContent value="sell" className="mt-0 space-y-4">
              {sellItems.map((item, index) => (
                <Card key={item.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.pages.calculator.item} {index + 1}
                      </CardTitle>
                      {sellItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeSellItem(item.id)}
                          className="h-7 w-7 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.karat}
                        </Label>
                        <Select
                          dir={dir}
                          value={item.karat}
                          onValueChange={(value) => updateSellItem(item.id, "karat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="karat24">
                              24K - {LIVE_PRICES.karat24.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                            <SelectItem value="karat21">
                              21K - {LIVE_PRICES.karat21.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                            <SelectItem value="karat18">
                              18K - {LIVE_PRICES.karat18.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.weightGram}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) => updateSellItem(item.id, "weight", e.target.value)}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.dealerCut}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.dealerDeduction}
                          onChange={(e) => updateSellItem(item.id, "dealerDeduction", e.target.value)}
                          placeholder={t.pages.calculator.optional}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.cashback}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.cashback}
                          onChange={(e) => updateSellItem(item.id, "cashback", e.target.value)}
                          placeholder={t.pages.calculator.optional}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addSellItem}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                {t.pages.calculator.addAnotherItem}
              </Button>
            </TabsContent>

            {/* Tab Content - P&L Calculator (حاسبة المكسب والخسارة) */}
            <TabsContent value="pl" className="mt-0 space-y-4">
              {plItems.map((item, index) => (
                <Card key={item.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.pages.calculator.item} {index + 1}
                      </CardTitle>
                      {plItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removePLItem(item.id)}
                          className="h-7 w-7 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.karat}
                        </Label>
                        <Select
                          dir={dir}
                          value={item.karat}
                          onValueChange={(value) => updatePLItem(item.id, "karat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="karat24">
                              24K - {LIVE_PRICES.karat24.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                            <SelectItem value="karat21">
                              21K - {LIVE_PRICES.karat21.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                            <SelectItem value="karat18">
                              18K - {LIVE_PRICES.karat18.toLocaleString('en-US')} {t.common.egp}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.weight}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) => updatePLItem(item.id, "weight", e.target.value)}
                          placeholder="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.pricePerGram}
                        </Label>
                        <Input
                          type="number"
                          value={item.buyPrice}
                          readOnly
                          disabled
                          className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          {t.pages.calculator.workmanshipPerGram}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.workmanship}
                          onChange={(e) => updatePLItem(item.id, "workmanship", e.target.value)}
                          placeholder="150"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addPLItem}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                {t.pages.calculator.addAnotherItem}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* RESULTS SIDEBAR - Desktop Only */}
        <div className="hidden lg:block lg:col-span-3">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t.pages.calculator.summary}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* P&L Results */}
              {plResults.totalCost > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.totalInvested}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {plResults.totalCost.toLocaleString('en-US')} {t.common.egp}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.currentValue}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {plResults.totalCurrentValue.toLocaleString('en-US')} {t.common.egp}
                    </p>
                  </div>
                  <div className="pt-4 border-t space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.profitLoss}
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        plResults.isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {plResults.isProfit ? "+" : ""}
                      {plResults.difference.toLocaleString('en-US')}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        plResults.isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {plResults.isProfit ? "+" : ""}
                      {plResults.percentageChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : sellResults.totalMarketValue > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.marketValue}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {sellResults.totalMarketValue.toLocaleString('en-US')} {t.common.egp}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      {t.pages.calculator.totalDeduction}
                    </p>
                    <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      - {sellResults.totalDeduction.toLocaleString('en-US')}
                    </p>
                  </div>
                  <div className="pt-4 border-t space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.netCash}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {sellResults.totalCash.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              ) : buyResults.totalCost > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.rawGold}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {buyResults.totalBasePrice.toLocaleString('en-US')} {t.common.egp}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.workmanship}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {buyResults.totalWorkmanship.toLocaleString('en-US')} {t.common.egp}
                    </p>
                  </div>
                  <div className="pt-4 border-t space-y-1.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.pages.calculator.totalCost}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {buyResults.totalCost.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {t.pages.calculator.enterData}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Summary Footer */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 shadow-lg">
        {plResults.totalCost > 0 ? (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.pages.calculator.profitLoss}
                </p>
                <p className={cn(
                  "text-xl font-bold",
                  plResults.isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {plResults.isProfit ? "+" : ""}{plResults.difference.toLocaleString('en-US')}
                </p>
              </div>
              <div className="text-start">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.pages.calculator.change}
                </p>
                <p className={cn(
                  "text-xl font-bold",
                  plResults.isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {plResults.isProfit ? "+" : ""}{plResults.percentageChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ) : sellResults.totalMarketValue > 0 ? (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.pages.calculator.netCash}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {sellResults.totalCash.toLocaleString('en-US')}
                </p>
              </div>
              <div className="text-start">
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                  {t.pages.calculator.deduction}
                </p>
                <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                  - {sellResults.totalDeduction.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          </div>
        ) : buyResults.totalCost > 0 ? (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.pages.calculator.totalCost}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {buyResults.totalCost.toLocaleString('en-US')}
                </p>
              </div>
              <div className="text-start">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.pages.calculator.work}
                </p>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {buyResults.totalWorkmanship.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {t.pages.calculator.enterDataSummary}
            </p>
          </div>
        )}
      </div>

      </div>
      )}
    </div>
  );
}
