"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Bell, Plus, Edit, Trash2, MoreVertical, X, Eye, EyeOff, AlertCircle, CheckCircle, Coins, Flag, TrendingUp, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { PriceAlert } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for available products
const AVAILABLE_PRODUCTS = [
  // Gold products
  { code: "k24", name: "عيار 24", type: "gold" as const, currentPrice: 3650 },
  { code: "k21", name: "عيار 21", type: "gold" as const, currentPrice: 3200 },
  { code: "k18", name: "عيار 18", type: "gold" as const, currentPrice: 2750 },
  // Currency products
  { code: "USD", name: "دولار أمريكي", type: "currency" as const, currentPrice: 50.85 },
  { code: "EUR", name: "يورو", type: "currency" as const, currentPrice: 54.20 },
  { code: "GBP", name: "جنيه إسترليني", type: "currency" as const, currentPrice: 63.50 },
  { code: "SAR", name: "ريال سعودي", type: "currency" as const, currentPrice: 13.56 },
  { code: "AED", name: "درهم إماراتي", type: "currency" as const, currentPrice: 13.84 },
];

const STORAGE_KEY = "nezzel_price_alerts";
const ONBOARDING_DISMISSED_KEY = "nezzel_alerts_onboarding_dismissed";

// Color constants for consistent design
const PRIMARY_COLOR = "amber";
const SECONDARY_COLOR = "slate";

export default function AlertsPage() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const [showTriggeredOnly, setShowTriggeredOnly] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check onboarding dismissal state on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(ONBOARDING_DISMISSED_KEY);
      if (dismissed !== "true") {
        setShowOnboarding(true);
      }
    } catch {
      setShowOnboarding(true);
    }
  }, []);

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    } catch (error) {
      console.error("Error saving onboarding state:", error);
    }
  };

  // Load alerts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedAlerts = JSON.parse(stored);
        setAlerts(parsedAlerts);
      }
    } catch (error) {
      console.error("Error loading alerts from localStorage:", error);
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (error) {
      console.error("Error saving alerts to localStorage:", error);
    }
  }, [alerts]);

  // Filter alerts based on trigger status
  const filteredAlerts = useMemo(() => {
    if (showTriggeredOnly) {
      return alerts.filter(alert => alert.isTriggered);
    }
    return alerts;
  }, [alerts, showTriggeredOnly]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeAlerts = alerts.filter(alert => alert.isActive);
    const triggeredAlerts = alerts.filter(alert => alert.isTriggered);
    return {
      total: alerts.length,
      active: activeAlerts.length,
      triggered: triggeredAlerts.length,
    };
  }, [alerts]);

  // Handle delete
  const handleDelete = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Handle toggle active status
  const handleToggleActive = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  // Handle edit
  const handleEdit = (alert: PriceAlert) => {
    setEditingAlert(alert);
    setIsAddModalOpen(true);
  };

  // Handle save (add or edit)
  const handleSave = (formData: Omit<PriceAlert, "id">) => {
    if (editingAlert) {
      // Update existing alert
      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert.id ? { ...formData, id: editingAlert.id } : alert
      ));
      setEditingAlert(null);
    } else {
      // Add new alert
      const newAlert: PriceAlert = {
        ...formData,
        id: Date.now().toString(),
      };
      setAlerts(prev => [...prev, newAlert]);
    }
    setIsAddModalOpen(false);
  };

  // Get product display name
  const getProductDisplayName = (productCode: string) => {
    const product = AVAILABLE_PRODUCTS.find(p => p.code === productCode);
    return product ? product.name : productCode;
  };

  // Get product current price
  const getProductCurrentPrice = (productCode: string) => {
    const product = AVAILABLE_PRODUCTS.find(p => p.code === productCode);
    return product ? product.currentPrice : 0;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/10 flex items-center justify-center">
            <Bell className="h-4.5 w-4.5 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {t.pages.alerts.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t.pages.alerts.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Card>
          <CardContent className="p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t.pages.alerts.total}</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/10 flex items-center justify-center">
                <Bell className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t.pages.alerts.active}</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{stats.active}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/10 flex items-center justify-center">
                <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t.pages.alerts.triggered}</p>
                <p className="text-xl font-bold text-rose-600 dark:text-rose-500">{stats.triggered}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/10 flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding: How Alerts Work */}
      {showOnboarding && (
        <HowAlertsWork
          onDismiss={handleDismissOnboarding}
          onAddAlert={() => {
            handleDismissOnboarding();
            setEditingAlert(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTriggeredOnly(!showTriggeredOnly)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors",
              showTriggeredOnly
                ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-500"
                : "border-slate-200 dark:border-slate-700 text-muted-foreground hover:text-foreground"
            )}
          >
            {showTriggeredOnly ? (
              <>
                <EyeOff className="h-3 w-3" />
                <span>عرض جميع التنبيهات</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                <span>عرض التنبيهات المنشطة فقط</span>
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          {showTriggeredOnly
            ? `${filteredAlerts.length} من التنبيهات المنشطة`
            : `${filteredAlerts.length} من إجمالي التنبيهات`}
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
              <Bell className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="font-semibold text-sm mb-1">
              {showTriggeredOnly 
                ? "لا توجد تنبيهات منشطة"
                : t.pages.alerts.noAlertsTitle}
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-3">
              {showTriggeredOnly
                ? "لا توجد تنبيهات تم تنشيطها بعد. ستظهر هنا عندما تصل الأسعار إلى المستويات المحددة."
                : t.pages.alerts.noAlertsDescription}
            </p>
            {!showTriggeredOnly && (
              <Button
                onClick={() => {
                  setEditingAlert(null);
                  setIsAddModalOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-sm h-8 px-3"
              >
                <Plus className="h-3.5 w-3.5 ml-1.5" />
                {t.pages.alerts.addFirstAlert}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredAlerts.map((alert) => {
            const currentPrice = getProductCurrentPrice(alert.productCode);
            const isBelowCondition = alert.condition === "below";
            const isTriggered = alert.isTriggered;
            const isActive = alert.isActive;

            return (
              <Card
                key={alert.id}
                className={cn(
                  "relative hover:shadow-md transition-shadow border",
                  isTriggered
                    ? "border-amber-200 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/5"
                    : isActive
                    ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5"
                    : "border-slate-200 dark:border-slate-700/50"
                )}
              >
                {/* Status Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-md text-xs font-medium",
                      isTriggered
                        ? "bg-amber-500/90 text-white"
                        : isActive
                        ? "bg-emerald-500/90 text-white"
                        : "bg-slate-400 text-white"
                    )}
                  >
                    {isTriggered
                      ? t.pages.alerts.triggered
                      : isActive
                      ? t.pages.alerts.active
                      : t.pages.alerts.disabled}
                  </div>
                </div>

                {/* Edit/Delete Menu - Top Right Corner */}
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(alert)}>
                        <Edit className="h-3.5 w-3.5 ml-1.5" />
                        {t.pages.alerts.editAlert}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(alert.id)}>
                        {isActive ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5 ml-1.5" />
                            {t.pages.alerts.disableAlert}
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 ml-1.5" />
                            {t.pages.alerts.enableAlert}
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(alert.id)}
                        className="text-rose-600 dark:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5 ml-1.5" />
                        {t.pages.alerts.deleteAlert}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardContent className="p-3">
                  {/* Product Info */}
                  <div className="flex items-start gap-2 mb-2.5">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-md shrink-0 p-1.5",
                        alert.type === "gold"
                          ? "bg-amber-50 dark:bg-amber-950/10"
                          : "bg-slate-50 dark:bg-slate-800/50"
                      )}
                    >
                      {alert.type === "gold" ? (
                        <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
                      ) : (
                        <Flag className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-bold text-sm mb-0.5",
                        alert.type === "gold"
                          ? "text-amber-700 dark:text-amber-600"
                          : "text-slate-600 dark:text-slate-400"
                      )}>
                        {getProductDisplayName(alert.productCode)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {alert.type === "gold" ? t.pages.alerts.gold : t.pages.alerts.currency}
                      </p>
                    </div>
                  </div>

                  {/* Target Price */}
                  <div className="mb-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {t.pages.alerts.targetPrice}
                    </p>
                    <p className="text-base font-bold tabular-nums">
                      {formatPrice(alert.targetPrice)}
                      <span className="text-xs font-normal text-muted-foreground mr-1">
                        {t.common.egp}
                      </span>
                    </p>
                  </div>

                  {/* Condition */}
                  <div className="mb-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {t.pages.alerts.condition}
                    </p>
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
                      isBelowCondition
                        ? "bg-sky-50 dark:bg-sky-950/10 text-sky-700 dark:text-sky-500"
                        : "bg-emerald-50 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-500"
                    )}>
                      {isBelowCondition ? (
                        <>
                          <span>↓</span>
                          <span>{t.pages.alerts.whenPriceDropsBelow}</span>
                        </>
                      ) : (
                        <>
                          <span>↑</span>
                          <span>{t.pages.alerts.whenPriceRisesAbove}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Current Price Comparison */}
                  <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground">السعر الحالي:</span>
                      <span className="text-xs font-semibold tabular-nums">
                        {formatPrice(currentPrice)} {t.common.egp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">المسافة:</span>
                      <span className={cn(
                        "text-xs font-semibold tabular-nums",
                        isBelowCondition
                          ? currentPrice <= alert.targetPrice
                            ? "text-rose-600 dark:text-rose-500"
                            : "text-emerald-600 dark:text-emerald-500"
                          : currentPrice >= alert.targetPrice
                          ? "text-rose-600 dark:text-rose-500"
                          : "text-emerald-600 dark:text-emerald-500"
                      )}>
                        {isBelowCondition
                          ? `${formatPrice(currentPrice - alert.targetPrice)} ${t.common.egp}`
                          : `${formatPrice(alert.targetPrice - currentPrice)} ${t.common.egp}`}
                      </span>
                    </div>
                  </div>

                  {/* Created Date */}
                  {alert.createdAt && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-xs text-muted-foreground">
                        {t.pages.alerts.createdAt}: {new Date(alert.createdAt).toLocaleDateString("ar-EG-u-nu-latn")}
                      </p>
                    </div>
                  )}

                  {/* Triggered Date */}
                  {alert.triggeredAt && (
                    <div className="mt-0.5">
                      <p className="text-xs text-muted-foreground">
                        {t.pages.alerts.triggeredOn}: {new Date(alert.triggeredAt).toLocaleDateString("ar-EG-u-nu-latn")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Action Button */}
      {!showTriggeredOnly && (
        <button
          onClick={() => {
            setEditingAlert(null);
            setIsAddModalOpen(true);
          }}
          className={cn(
            "fixed bottom-5 left-5 z-40",
            "flex items-center gap-2 px-3.5 py-2 rounded-full",
            "bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm",
            "shadow-lg shadow-amber-500/20",
            "transition-all hover:scale-105 active:scale-95"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>{t.pages.alerts.addAlert}</span>
        </button>
      )}

      {/* Add/Edit Alert Modal */}
      {isAddModalOpen && (
        <AddAlertModal
          alert={editingAlert}
          onSave={handleSave}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingAlert(null);
          }}
        />
      )}
    </div>
  );
}

// How Alerts Work - Onboarding Illustration
interface HowAlertsWorkProps {
  onDismiss: () => void;
  onAddAlert: () => void;
}

function HowAlertsWork({ onDismiss, onAddAlert }: HowAlertsWorkProps) {
  return (
    <Card className="relative overflow-hidden border-amber-200/50 dark:border-amber-900/30 bg-gradient-to-l from-amber-50/30 via-transparent to-transparent dark:from-amber-950/10 dark:via-transparent dark:to-transparent">
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">
            كيف تعمل التنبيهات؟
          </h3>
          <button
            onClick={onDismiss}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="إغلاق"
          >
            <span>إغلاق</span>
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* 3-Step Visual */}
        <div className="flex items-start justify-between gap-2">
          {/* Step 1: Set target price */}
          <div className="flex-1 flex flex-col items-center text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both">
            <div className="relative h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center mb-2">
              <Coins className="h-5 w-5 text-amber-600 dark:text-amber-500 animate-pulse" />
              <Badge
                variant="secondary"
                className="absolute -bottom-1.5 start-0 text-[9px] px-1 py-0 h-4 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 shadow-sm"
              >
                3,500
              </Badge>
            </div>
            <p className="text-[11px] font-semibold text-foreground leading-tight">
              حدد السعر
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              المستهدف
            </p>
          </div>

          {/* Connector 1 */}
          <div className="flex items-center pt-5 animate-in fade-in-0 duration-300 delay-300 fill-mode-both">
            <div className="flex items-center gap-0.5 text-muted-foreground/40">
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
              <ArrowLeft className="h-3 w-3" />
            </div>
          </div>

          {/* Step 2: Price changes */}
          <div className="flex-1 flex flex-col items-center text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/20 flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-500 animate-float-up" />
            </div>
            <p className="text-[11px] font-semibold text-foreground leading-tight">
              السعر يتغير
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              نراقب لحظياً
            </p>
          </div>

          {/* Connector 2 */}
          <div className="flex items-center pt-5 animate-in fade-in-0 duration-300 delay-500 fill-mode-both">
            <div className="flex items-center gap-0.5 text-muted-foreground/40">
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
              <ArrowLeft className="h-3 w-3" />
            </div>
          </div>

          {/* Step 3: Notification received */}
          <div className="flex-1 flex flex-col items-center text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
            <div className="relative h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-950/20 flex items-center justify-center mb-2">
              <Bell className="h-5 w-5 text-sky-600 dark:text-sky-500 animate-wiggle" />
              <span className="absolute top-1 end-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
            </div>
            <p className="text-[11px] font-semibold text-foreground leading-tight">
              تصلك إشعار
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              فوراً
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onAddAlert}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7 px-4 rounded-full shadow-sm"
          >
            <Plus className="h-3 w-3 ms-1" />
            أضف أول تنبيه
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Add Alert Modal Component
interface AddAlertModalProps {
  alert: PriceAlert | null;
  onSave: (data: Omit<PriceAlert, "id">) => void;
  onClose: () => void;
}

function AddAlertModal({ alert, onSave, onClose }: AddAlertModalProps) {
  const { t } = useLanguage();
  const [type, setType] = useState<"gold" | "currency">(alert?.type || "gold");
  const [productCode, setProductCode] = useState(alert?.productCode || "");
  const [targetPrice, setTargetPrice] = useState(alert?.targetPrice.toString() || "");
  const [condition, setCondition] = useState<"below" | "above">(alert?.condition || "below");
  const [isActive, setIsActive] = useState(alert?.isActive !== false);

  // Filter products by type
  const filteredProducts = useMemo(() => {
    return AVAILABLE_PRODUCTS.filter(product => product.type === type);
  }, [type]);

  // Update product code when type changes
  useEffect(() => {
    if (filteredProducts.length > 0 && !productCode) {
      setProductCode(filteredProducts[0].code);
    }
  }, [type, filteredProducts, productCode]);

  // Get selected product
  const selectedProduct = useMemo(() => {
    return AVAILABLE_PRODUCTS.find(product => product.code === productCode);
  }, [productCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      productCode,
      productName: selectedProduct?.name || productCode,
      targetPrice: parseFloat(targetPrice),
      condition,
      currentPrice: selectedProduct?.currentPrice,
      isActive,
      isTriggered: false,
      createdAt: alert?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Panel - Responsive: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="relative w-full md:max-w-2xl md:w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-xl md:shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">
            {alert ? t.pages.alerts.editAlert : t.pages.alerts.addAlert}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form with Responsive Grid Layout */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.pages.alerts.selectType}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("gold")}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-lg border-2 transition-all text-sm",
                    type === "gold"
                      ? "border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/10"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  {t.pages.alerts.gold}
                </button>
                <button
                  type="button"
                  onClick={() => setType("currency")}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-lg border-2 transition-all text-sm",
                    type === "currency"
                      ? "border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/10"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  {t.pages.alerts.currency}
                </button>
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.pages.alerts.selectProduct}
              </label>
              <select
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              >
                <option value="">{t.pages.alerts.selectProduct}</option>
                {filteredProducts.map((product) => (
                  <option key={product.code} value={product.code}>
                    {product.name} ({formatPrice(product.currentPrice)} {t.common.egp})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.pages.alerts.targetPrice} ({t.common.egp})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                  min="0"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  placeholder="أدخل السعر المستهدف"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {t.common.egp}
                </div>
              </div>
              {selectedProduct && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  السعر الحالي: {formatPrice(selectedProduct.currentPrice)} {t.common.egp}
                </p>
              )}
            </div>

            {/* Condition Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.pages.alerts.condition}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCondition("below")}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-1.5 text-sm",
                    condition === "below"
                      ? "border-sky-400 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/10"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  <span>↓</span>
                  <span>{t.pages.alerts.whenPriceDropsBelow}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition("above")}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-1.5 text-sm",
                    condition === "above"
                      ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/10"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  <span>↑</span>
                  <span>{t.pages.alerts.whenPriceRisesAbove}</span>
                </button>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-sm">{t.pages.alerts.enableAlert}</p>
                <p className="text-xs text-muted-foreground">
                  {isActive ? "التنبيه نشط ومراقب" : "التنبيه معطل وغير مراقب"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    isActive ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Actions - Full Width */}
            <div className="col-span-full flex gap-2.5 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-9"
              >
                {t.pages.portfolio.cancel}
              </Button>
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 h-9">
                {t.pages.portfolio.save}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
