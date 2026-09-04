"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { useGoldOverview } from "@/hooks/use-gold-prices";
import { useSilverOverview } from "@/hooks/use-silver-prices";
import { useLanguage } from "@/contexts/language-context";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Nisab threshold: 85 grams of 24k pure gold
const NISAB_GRAMS = 85;
const ZAKAT_RATE = 0.025; // 2.5%

interface FieldConfig {
  key: 'gold21' | 'silver999' | 'cash' | 'debts';
  label: string;
  hint: string;
}

export default function GoldZakatPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { data: goldData } = useGoldOverview();
  const { data: silverData } = useSilverOverview();

  const gold21Price = goldData?.data?.gold?.['21']?.price.buy ?? 0;
  const gold24Price = goldData?.data?.gold?.['24']?.price.buy ?? 0;
  const silver999Price = silverData?.data?.silver?.['999_egyptian']?.price.buy ?? 0;

  const FIELDS: FieldConfig[] = [
    {
      key: 'gold21',
      label: isRTL ? 'ذهب لديك (جرام، عيار 21)' : 'Gold you own (grams, 21k)',
      hint: isRTL ? 'الوزن الإجمالي للذهب المملوك بعيار 21' : 'Total weight of owned 21k gold',
    },
    {
      key: 'silver999',
      label: isRTL ? 'فضة لديك (جرام، عيار 999)' : 'Silver you own (grams, 999)',
      hint: isRTL ? 'الوزن الإجمالي للفضة الخالصة المملوكة' : 'Total weight of owned pure silver',
    },
    {
      key: 'cash',
      label: isRTL ? 'نقود وودائع (جنيه)' : 'Cash and deposits (EGP)',
      hint: isRTL ? 'النقد والمدخرات وأرصدة الحسابات البنكية' : 'Cash, savings, and bank account balances',
    },
    {
      key: 'debts',
      label: isRTL ? 'ديون عليك (جنيه)' : 'Debts owed by you (EGP)',
      hint: isRTL ? 'الديون المستحقة عليك والواجب سدادها قريباً' : 'Debts due from you that must be repaid soon',
    },
  ];

  const [values, setValues] = useState<Record<FieldConfig['key'], string>>({
    gold21: '',
    silver999: '',
    cash: '',
    debts: '',
  });
  const [hasHawl, setHasHawl] = useState(true);

  const updateValue = (key: FieldConfig['key'], value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const parsed = useMemo(() => ({
    gold21: parseFloat(values.gold21) || 0,
    silver999: parseFloat(values.silver999) || 0,
    cash: parseFloat(values.cash) || 0,
    debts: parseFloat(values.debts) || 0,
  }), [values]);

  const goldValue = parsed.gold21 * gold21Price;
  const silverValue = parsed.silver999 * silver999Price;
  const netAssets = goldValue + silverValue + parsed.cash - parsed.debts;
  const nisabValue = NISAB_GRAMS * gold24Price;

  const hasAnyInput = parsed.gold21 > 0 || parsed.silver999 > 0 || parsed.cash > 0 || parsed.debts > 0;
  const isAboveNisab = nisabValue > 0 && netAssets >= nisabValue;
  const zakatDue = isAboveNisab && hasHawl ? netAssets * ZAKAT_RATE : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isRTL ? "الأدوات" : "Tools"}
        title={isRTL ? "حاسبة الزكاة" : "Zakat Calculator"}
        lead={
          isRTL
            ? `نصاب الزكاة يعادل ${formatNumber(NISAB_GRAMS)} جراماً من الذهب عيار 24، ونسبة الزكاة الواجبة 2.5% من إجمالي المال إذا بلغ النصاب ومر عليه الحول.`
            : `The Zakat nisab equals ${formatNumber(NISAB_GRAMS)} grams of 24k gold, and the due Zakat rate is 2.5% of total wealth if it reaches the nisab and a full lunar year (hawl) has passed.`
        }
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-panel2 border border-line hover:border-gold text-text transition-colors text-[13px] font-medium"
                aria-label={isRTL ? "كيف يعمل" : "How it works"}
              >
                <AlertCircle className="h-4 w-4" />
                <span>{isRTL ? "كيف يعمل" : "How it works"}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{isRTL ? "معلومات مهمة" : "Important Information"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm text-muted mt-4">
                <div className="space-y-2">
                  <p className="font-medium text-text">{isRTL ? "النصاب:" : "Nisab:"}</p>
                  <p>
                    {isRTL
                      ? "85 جرام من الذهب الخالص (عيار 24) أو ما يعادله من المال."
                      : "85 grams of pure gold (24k) or its cash equivalent."}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-text">{isRTL ? "نسبة الزكاة:" : "Zakat rate:"}</p>
                  <p>
                    {isRTL
                      ? "2.5% من إجمالي قيمة المال (الذهب + الفضة + النقود − الديون)."
                      : "2.5% of total wealth value (gold + silver + cash − debts)."}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-text">{isRTL ? "الحول:" : "Hawl:"}</p>
                  <p>
                    {isRTL
                      ? "يجب أن يمر على المال عام هجري كامل (حوالي 354 يوم) منذ بلوغه النصاب."
                      : "A full lunar year (about 354 days) must pass on the wealth since it reached the nisab."}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <SectionCard title={isRTL ? "بيانات ممتلكاتك" : "Your Assets"} padded>
          <div className="space-y-4">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-[12px] text-muted mb-1.5">{field.label}</label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={values[field.key]}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                  placeholder="0"
                />
                <p className="mt-1 text-[11.5px] text-dim">{field.hint}</p>
              </div>
            ))}

            <label className="flex items-start gap-3 p-3.5 rounded-[11px] bg-panel2 border border-line cursor-pointer">
              <input
                type="checkbox"
                checked={hasHawl}
                onChange={(e) => setHasHawl(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-gold"
              />
              <span className="flex-1 text-[13px] text-text">
                <span className="font-medium">
                  {isRTL ? "مرّ عليه عام هجري كامل (الحول)" : "A full lunar year has passed (hawl)"}
                </span>
                <span className="block text-[11.5px] text-dim mt-1">
                  {isRTL
                    ? "يجب أن يمر على المال عام هجري كامل حتى تجب الزكاة"
                    : "A full lunar year must pass on the wealth for Zakat to be due"}
                </span>
              </span>
            </label>
          </div>
        </SectionCard>

        {/* Result */}
        {hasAnyInput ? (
          isAboveNisab && hasHawl ? (
            <div className="bg-gold-soft shadow-gold rounded-2xl p-6 md:p-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[13px] text-muted mb-2">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>{isRTL ? "الزكاة المستحقة عليك" : "Zakat due from you"}</span>
              </div>
              <div className="num text-[40px] md:text-[52px] font-medium text-gold leading-none">
                {formatNumber(parseFloat(zakatDue.toFixed(2)))}
              </div>
              <div className="text-[14px] text-muted mt-2">{isRTL ? "جنيه مصري" : "Egyptian Pound"}</div>
              <p className="mt-3 text-[12.5px] text-dim">
                {isRTL
                  ? `بلغ إجمالي مالك النصاب (${formatNumber(parseFloat(nisabValue.toFixed(0)))} ج.م) ومرّ عليه الحول.`
                  : `Your total wealth reached the nisab (${formatNumber(parseFloat(nisabValue.toFixed(0)))} EGP) and the hawl has passed.`}
              </p>

              <div className="mt-6 space-y-2.5 border-t border-gold-line pt-4">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted">{isRTL ? "قيمة الذهب" : "Gold Value"}</span>
                  <span className="num text-text">{formatNumber(parseFloat(goldValue.toFixed(2)))}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted">{isRTL ? "قيمة الفضة" : "Silver Value"}</span>
                  <span className="num text-text">{formatNumber(parseFloat(silverValue.toFixed(2)))}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted">
                    {isRTL ? "صافي المال (بعد خصم الديون)" : "Net Wealth (after debts)"}
                  </span>
                  <span className="num text-text">{formatNumber(parseFloat(netAssets.toFixed(2)))}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted">{isRTL ? "نسبة الزكاة" : "Zakat Rate"}</span>
                  <span className="num text-text">2.5%</span>
                </div>
              </div>
            </div>
          ) : (
            <SectionCard padded className="h-fit">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-[15px] font-semibold text-text">
                    {isAboveNisab
                      ? (isRTL ? 'لم يمر عام هجري كامل' : 'A full lunar year has not passed')
                      : (isRTL ? 'لا تجب فيه الزكاة بعد' : 'Zakat is not yet due')}
                  </h3>
                  <p className="text-[13px] text-muted leading-relaxed">
                    {isAboveNisab
                      ? (isRTL
                          ? `صافي مالك (${formatNumber(parseFloat(netAssets.toFixed(2)))} ج.م) بلغ النصاب، لكن يجب أن يمر عليه عام هجري كامل حتى تجب الزكاة.`
                          : `Your net wealth (${formatNumber(parseFloat(netAssets.toFixed(2)))} EGP) has reached the nisab, but a full lunar year must pass before Zakat is due.`)
                      : (isRTL
                          ? `صافي مالك (${formatNumber(parseFloat(netAssets.toFixed(2)))} ج.م) أقل من قيمة النصاب (${nisabValue > 0 ? formatNumber(parseFloat(nisabValue.toFixed(0))) : '—'} ج.م).`
                          : `Your net wealth (${formatNumber(parseFloat(netAssets.toFixed(2)))} EGP) is below the nisab value (${nisabValue > 0 ? formatNumber(parseFloat(nisabValue.toFixed(0))) : '—'} EGP).`)}
                  </p>
                </div>
              </div>
            </SectionCard>
          )
        ) : (
          <SectionCard padded className="h-fit">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <Info className="h-8 w-8 text-dim mx-auto" />
                <p className="text-[13px] text-muted">
                  {isRTL ? "أدخل بيانات ممتلكاتك لعرض النتيجة" : "Enter your assets to see the result"}
                </p>
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
