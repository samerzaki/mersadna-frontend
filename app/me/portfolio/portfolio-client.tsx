"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Wallet,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Coins,
  Flag,
  X,
  Activity,
  Gem,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { formatPrice, formatRelativeTime } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkline } from "@/components/currency/sparkline";
import { ApiError } from "@/components/ui/api-error";
import {
  usePortfolio,
  useCreatePortfolioItem,
  useUpdatePortfolioItem,
  useDeletePortfolioItem,
} from "@/hooks/use-portfolio";
import type {
  PortfolioItem,
  PortfolioAssetType,
  PortfolioFilterType,
  CreatePortfolioItemRequest,
} from "@/types/portfolio";

// Consistent select styling to match the Input component
const selectClassName =
  "flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-slate-300";

const ALLOCATION_COLORS: Record<string, string> = {
  gold: "#D4740C",   // --primary
  silver: "#94a3b8",  // slate-400
  currency: "#64748b", // slate-500
};

// Generate mock sparkline data showing price trend (until backend provides chart_points)
function generateSparklineData(
  buyPrice: number,
  currentPrice: number
): number[] {
  const points = 10;
  const data: number[] = [];
  const diff = currentPrice - buyPrice;
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const base = buyPrice + diff * progress;
    const noise = (Math.random() - 0.5) * Math.abs(diff) * 0.1;
    data.push(base + noise);
  }
  return data;
}

// Allocation chart custom tooltip
function AllocationTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: number } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg text-start">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatPrice(data.value)} ج.م
        </p>
        <p className="text-xs font-medium">{data.percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
}

// Type icon helper
function AssetIcon({ type, className }: { type: PortfolioAssetType; className?: string }) {
  switch (type) {
    case "gold":
      return <Coins className={cn("text-primary", className)} />;
    case "silver":
      return <Gem className={cn("text-slate-400", className)} />;
    case "currency":
      return <Flag className={cn("text-muted-foreground", className)} />;
  }
}

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [isHidden, setIsHidden] = useState(false);
  const [filter, setFilter] = useState<PortfolioFilterType>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Stable sparkline data (generated once per item via ref)
  const sparklineCache = useRef<Record<number, number[]>>({});

  // API data
  const { data: portfolioData, isLoading, error, refetch } = usePortfolio();
  const deleteMutation = useDeletePortfolioItem();

  const items = portfolioData?.data ?? [];
  const summary = portfolioData?.meta?.summary;
  const counts = portfolioData?.meta?.counts;

  // Get or create stable sparkline data for an item
  const getSparklineData = (item: PortfolioItem): number[] => {
    if (!sparklineCache.current[item.id]) {
      sparklineCache.current[item.id] = generateSparklineData(
        item.buy_price,
        item.current_price
      );
    }
    return sparklineCache.current[item.id];
  };

  // Mock portfolio history for the mini area chart
  const portfolioHistory = useMemo(() => {
    if (!summary || summary.total_current_value === 0) return [];
    const total = summary.total_current_value;
    const cost = summary.total_cost_basis;
    const points = 12;
    const diff = total - cost;
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1);
      const base = cost + diff * progress;
      const noise = (Math.random() - 0.5) * Math.abs(diff) * 0.05;
      return { value: Math.max(0, base + noise) };
    });
  }, [summary?.total_current_value, summary?.total_cost_basis]);

  // Allocation data for pie chart (from API)
  const allocationData = useMemo(() => {
    if (!summary) return [];
    const alloc = summary.allocation;
    const labelMap: Record<string, string> = {
      gold: t.pages.portfolio.gold,
      silver: "فضة",
      currency: t.pages.portfolio.currencies,
    };
    return Object.entries(alloc)
      .filter(([, v]) => v.value > 0)
      .map(([key, v]) => ({
        name: labelMap[key] || key,
        value: v.value,
        percentage: v.percentage,
        color: ALLOCATION_COLORS[key] || "#94a3b8",
      }));
  }, [summary, t]);

  // Filter items client-side
  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  // Handlers
  const handleDelete = (id: number) => {
    sparklineCache.current = {};
    deleteMutation.mutate(id);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
    sparklineCache.current = {};
  };

  const isProfit = (summary?.total_profit_loss ?? 0) >= 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 pb-24">
        {/* Hero skeleton */}
        <div className="rounded-lg border p-6">
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="h-12 w-48 bg-muted rounded animate-pulse mb-3" />
          <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="h-8 w-8 bg-muted rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse mb-1" />
              <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-7 w-7 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-5 w-16 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <ApiError error={error} retry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* ═══════════════════════════════════════════════════════
          Section 1 + 3: Hero Card + Asset Allocation (same row)
          ═══════════════════════════════════════════════════════ */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500",
          allocationData.length > 0 ? "md:grid-cols-5" : ""
        )}
      >
        {/* Hero Card - Total Wealth */}
        <Card className={cn(
          "relative overflow-hidden",
          allocationData.length > 0 ? "md:col-span-3" : ""
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-950/20 dark:to-transparent" />

          <CardContent className="relative p-5 md:p-6 h-full flex flex-col">
            {/* Top row: Label + Privacy toggle */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.pages.portfolio.totalWealth}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHidden(!isHidden)}
                className="h-8 w-8"
                aria-label={isHidden ? "إظهار الأرقام" : "إخفاء الأرقام"}
              >
                {isHidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Total value */}
            <div className={cn("mb-3", isHidden && "blur-md select-none")}>
              <p className="text-4xl md:text-5xl font-bold tabular-nums mb-1">
                {formatPrice(summary?.total_current_value ?? 0)}
              </p>
              <span className="text-sm text-muted-foreground">
                {t.common.egp}
              </span>
            </div>

            {/* Profit/Loss pill */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold mb-4",
                isProfit
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
                isHidden && "blur-md select-none"
              )}
            >
              {isProfit ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{formatPrice(summary?.total_profit_loss ?? 0)}</span>
              <span className="opacity-70">
                ({(summary?.profit_loss_percent ?? 0) >= 0 ? "+" : ""}
                {(summary?.profit_loss_percent ?? 0).toFixed(2)}%)
              </span>
            </div>

            {/* Mini portfolio performance chart */}
            {portfolioHistory.length > 0 && (
              <div className={cn("h-16 md:h-20 mt-auto", isHidden && "blur-md")}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioHistory}>
                    <defs>
                      <linearGradient
                        id="portfolioGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={isProfit ? "#16a34a" : "#dc2626"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor={isProfit ? "#16a34a" : "#dc2626"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={isProfit ? "#16a34a" : "#dc2626"}
                      fill="url(#portfolioGradient)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Last updated */}
            <p className="text-xs text-muted-foreground mt-3">
              آخر تحديث: {formatRelativeTime(new Date())}
            </p>
          </CardContent>
        </Card>

        {/* Asset Allocation (PieChart) */}
        {allocationData.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.pages.portfolio.assetDistribution}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {/* Pie Chart */}
              <div
                className={cn(
                  "w-full",
                  isHidden && "blur-md select-none"
                )}
              >
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={4}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<AllocationTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="w-full space-y-3">
                {allocationData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-end">
                      <p
                        className={cn(
                          "text-sm font-bold tabular-nums",
                          isHidden && "blur-sm"
                        )}
                      >
                        {item.percentage.toFixed(1)}%
                      </p>
                      <p
                        className={cn(
                          "text-xs text-muted-foreground tabular-nums",
                          isHidden && "blur-sm"
                        )}
                      >
                        {formatPrice(item.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          Section 2: Quick Stats Row
          ═══════════════════════════════════════════════════════ */}
      {items.length > 0 && summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-100">
          {/* Total Assets */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-950/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-0.5">
                إجمالي الأصول
              </p>
              <p className="text-xl font-bold tabular-nums">
                {counts?.all ?? items.length}
              </p>
            </CardContent>
          </Card>

          {/* Best Performer */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-0.5 truncate">
                {summary.best_performer?.name ?? "—"}
              </p>
              <p
                className={cn(
                  "text-sm font-bold text-success tabular-nums",
                  isHidden && "blur-sm"
                )}
              >
                {summary.best_performer
                  ? `+${summary.best_performer.profit_loss_percent.toFixed(1)}%`
                  : "—"}
              </p>
            </CardContent>
          </Card>

          {/* Worst Performer */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-0.5 truncate">
                {summary.worst_performer?.name ?? "—"}
              </p>
              <p
                className={cn(
                  "text-sm font-bold text-destructive tabular-nums",
                  isHidden && "blur-sm"
                )}
              >
                {summary.worst_performer
                  ? `${summary.worst_performer.profit_loss_percent.toFixed(1)}%`
                  : "—"}
              </p>
            </CardContent>
          </Card>

          {/* Overall Change */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    isProfit ? "bg-success/10" : "bg-destructive/10"
                  )}
                >
                  <Activity
                    className={cn(
                      "h-4 w-4",
                      isProfit ? "text-success" : "text-destructive"
                    )}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-0.5">
                إجمالي التغير
              </p>
              <p
                className={cn(
                  "text-sm font-bold tabular-nums",
                  isProfit ? "text-success" : "text-destructive",
                  isHidden && "blur-sm"
                )}
              >
                {(summary.profit_loss_percent ?? 0) >= 0 ? "+" : ""}
                {(summary.profit_loss_percent ?? 0).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          Section 4: Filter Tabs + Asset Cards
          ═══════════════════════════════════════════════════════ */}
      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={(v) => setFilter(v as PortfolioFilterType)}
        className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-300"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-1.5">
            <Wallet className="h-3.5 w-3.5" />
            <span>{t.pages.portfolio.all}</span>
            <Badge variant="secondary" className="ms-1 text-[10px] px-1.5">
              {counts?.all ?? items.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="gold" className="gap-1.5">
            <Coins className="h-3.5 w-3.5" />
            <span>{t.pages.portfolio.gold}</span>
            <Badge variant="secondary" className="ms-1 text-[10px] px-1.5">
              {counts?.gold ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="silver" className="gap-1.5">
            <Gem className="h-3.5 w-3.5" />
            <span>فضة</span>
            <Badge variant="secondary" className="ms-1 text-[10px] px-1.5">
              {counts?.silver ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5">
            <Flag className="h-3.5 w-3.5" />
            <span>{t.pages.portfolio.currencies}</span>
            <Badge variant="secondary" className="ms-1 text-[10px] px-1.5">
              {counts?.currency ?? 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-semibold mb-1">
                {t.pages.portfolio.noAssets}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {t.pages.portfolio.noAssetsDescription}
              </p>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 me-2" />
                {t.pages.portfolio.recordBuy}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredItems.map((item, index) => {
                const sparkData = getSparklineData(item);
                const itemIsProfit = item.profit_loss >= 0;

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "relative group transition-all duration-300",
                      "hover:shadow-lg hover:-translate-y-0.5",
                      "border hover:border-primary/20",
                      "animate-in fade-in-50 slide-in-from-bottom-4"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationDuration: "400ms",
                    }}
                  >
                    {/* Edit/Delete Menu - shows on hover */}
                    <div className="absolute top-1.5 end-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={4}>
                          <DropdownMenuItem
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4 me-2" />
                            {t.pages.portfolio.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 me-2" />
                            {t.pages.portfolio.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardContent className="p-3">
                      {/* Header: Icon + Name */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-md shrink-0 h-7 w-7",
                            item.type === "gold"
                              ? "bg-primary-50 dark:bg-primary-950/20"
                              : item.type === "silver"
                              ? "bg-slate-100 dark:bg-slate-800/50"
                              : "bg-muted"
                          )}
                        >
                          <AssetIcon type={item.type} className="h-3.5 w-3.5" />
                        </div>
                        <h3 className="font-semibold text-xs truncate flex-1 min-w-0">
                          {item.name}
                        </h3>
                      </div>

                      {/* Current Value */}
                      <p
                        className={cn(
                          "text-base font-bold tabular-nums mb-1",
                          isHidden && "blur-md select-none"
                        )}
                      >
                        {formatPrice(item.current_value)}
                      </p>

                      {/* Buy price (compact) */}
                      <p
                        className={cn(
                          "text-[10px] text-muted-foreground tabular-nums mb-2",
                          isHidden && "blur-sm select-none"
                        )}
                      >
                        {t.pages.portfolio.buyPrice ?? "الشراء"}: {formatPrice(item.buy_price)}
                      </p>

                      {/* Profit/Loss pill + sparkline row */}
                      <div className="flex items-end justify-between gap-1">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-tight",
                            itemIsProfit
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive",
                            isHidden && "blur-sm select-none"
                          )}
                        >
                          {itemIsProfit ? (
                            <TrendingUp className="h-2.5 w-2.5" />
                          ) : (
                            <TrendingDown className="h-2.5 w-2.5" />
                          )}
                          <span>
                            {item.profit_loss_percent >= 0 ? "+" : ""}
                            {item.profit_loss_percent.toFixed(1)}%
                          </span>
                        </div>

                        <div
                          className={cn(
                            "h-5 w-12 shrink-0",
                            isHidden && "blur-sm"
                          )}
                        >
                          <Sparkline
                            data={sparkData}
                            width={48}
                            height={20}
                            strokeWidth={1}
                            className="w-full opacity-40 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════
          Floating Action Button
          ═══════════════════════════════════════════════════════ */}
      <Button
        onClick={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
        size="lg"
        className={cn(
          "fixed bottom-6 start-6 z-40 rounded-full",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "hover:scale-110 active:scale-95"
        )}
      >
        <Plus className="h-5 w-5 me-2" />
        {t.pages.portfolio.recordBuy}
      </Button>

      {/* ═══════════════════════════════════════════════════════
          Add/Edit Asset Modal
          ═══════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <AddAssetModal
          item={editingItem}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Add Asset Modal Component
// ═══════════════════════════════════════════════════════

interface AddAssetModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

function AddAssetModal({ item, onClose }: AddAssetModalProps) {
  const { t } = useLanguage();
  const createMutation = useCreatePortfolioItem();
  const updateMutation = useUpdatePortfolioItem();

  const [type, setType] = useState<PortfolioAssetType>(item?.type || "gold");
  const [name, setName] = useState(item?.name || "");
  const [amount, setAmount] = useState(item?.amount.toString() || "");
  const [buyPrice, setBuyPrice] = useState(item?.buy_price.toString() || "");
  const [date, setDate] = useState(
    item?.purchase_date || new Date().toISOString().split("T")[0]
  );
  const [karat, setKarat] = useState<string>(
    item?.karat?.toString() || ""
  );
  const [currencyCode, setCurrencyCode] = useState<string>(
    item?.currency_code || ""
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreatePortfolioItemRequest = {
      type,
      name,
      amount: parseFloat(amount),
      buy_price: parseFloat(buyPrice),
      purchase_date: date,
      ...(type === "gold" && karat ? { karat: parseInt(karat) } : {}),
      ...(type === "silver" && karat ? { karat: parseInt(karat) } : {}),
      ...(type === "currency" && currencyCode ? { currency_code: currencyCode } : {}),
    };

    if (item) {
      updateMutation.mutate(
        { id: item.id, data },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onClose() });
    }
  };

  const typeButton = (value: PortfolioAssetType, label: string) => (
    <button
      type="button"
      onClick={() => {
        setType(value);
        if (value === "gold") { setKarat("24"); setCurrencyCode(""); }
        else if (value === "silver") { setKarat(""); setCurrencyCode(""); }
        else { setKarat(""); setCurrencyCode("USD"); }
      }}
      className={cn(
        "flex-1 px-4 py-2.5 rounded-md border text-sm font-medium transition-colors",
        type === value
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="إغلاق"
      />

      {/* Panel */}
      <div className="relative w-full md:max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-t-2xl md:rounded-2xl shadow-lg border">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">
            {item ? t.pages.portfolio.edit : t.pages.portfolio.addAsset}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mutation error */}
          {mutationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                {mutationError.message}
              </p>
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t.pages.portfolio.type}
            </label>
            <div className="flex gap-2">
              {typeButton("gold", t.pages.portfolio.gold)}
              {typeButton("silver", "فضة")}
              {typeButton("currency", t.pages.portfolio.currencies)}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              الاسم
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={
                type === "gold"
                  ? "مثال: سبيكة 10 جرام"
                  : type === "silver"
                  ? "مثال: سبيكة فضة 100 جرام"
                  : "مثال: دولار أمريكي"
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Karat / Currency Code */}
            {type === "gold" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.pages.calculator.karat}
                </label>
                <select
                  value={karat}
                  onChange={(e) => setKarat(e.target.value)}
                  required
                  className={selectClassName}
                >
                  <option value="">اختر العيار</option>
                  <option value="24">24 قيراط</option>
                  <option value="21">21 قيراط</option>
                  <option value="18">18 قيراط</option>
                </select>
              </div>
            ) : type === "currency" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.currency.currencyName}
                </label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  required
                  className={selectClassName}
                >
                  <option value="">اختر العملة</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                  <option value="KWD">KWD</option>
                </select>
              </div>
            ) : (
              /* Silver - no karat/currency needed, show amount in this spot */
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.pages.portfolio.amount}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                />
              </div>
            )}

            {/* Amount (for gold/currency, silver handled above) */}
            {type !== "silver" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.pages.portfolio.amount}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                />
              </div>
            )}

            {/* Buy Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t.pages.portfolio.pricePerUnit}
              </label>
              <Input
                type="number"
                step="0.01"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                required
                min="0"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t.pages.portfolio.date}
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPending}
            >
              {t.pages.portfolio.cancel}
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
              {t.pages.portfolio.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
