'use client';

import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  goldType: string;
  currentPrice: number;
  currency: string;
}

export function PriceAlertModal({ isOpen, onClose, goldType, currentPrice, currency }: PriceAlertModalProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [alertType, setAlertType] = useState<'increase' | 'decrease' | null>(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setAlertType(null);
    setTargetPrice('');
    setValidationError('');
    onClose();
  };

  const validatePrice = (price: string, type: 'increase' | 'decrease') => {
    const numPrice = parseFloat(price);

    if (isNaN(numPrice) || numPrice <= 0) {
      return isRTL ? 'الرجاء إدخال سعر صالح' : 'Please enter a valid price';
    }

    if (type === 'increase' && numPrice <= currentPrice) {
      return isRTL
        ? `السعر المستهدف يجب أن يكون أكبر من السعر الحالي (${currentPrice.toFixed(2)} ${currency})`
        : `Target price must be greater than current price (${currentPrice.toFixed(2)} ${currency})`;
    }

    if (type === 'decrease' && numPrice >= currentPrice) {
      return isRTL
        ? `السعر المستهدف يجب أن يكون أقل من السعر الحالي (${currentPrice.toFixed(2)} ${currency})`
        : `Target price must be less than current price (${currentPrice.toFixed(2)} ${currency})`;
    }

    return '';
  };

  const handlePriceChange = (value: string) => {
    setTargetPrice(value);
    if (alertType && value) {
      const error = validatePrice(value, alertType);
      setValidationError(error);
    } else {
      setValidationError('');
    }
  };

  const handleAlertTypeChange = (type: 'increase' | 'decrease') => {
    setAlertType(type);
    if (targetPrice) {
      const error = validatePrice(targetPrice, type);
      setValidationError(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!alertType || !targetPrice) return;

    const error = validatePrice(targetPrice, alertType);
    if (error) {
      setValidationError(error);
      return;
    }

    // TODO: Implement alert creation logic
    console.log('Creating alert:', { goldType, alertType, targetPrice });

    // Reset form and close
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isRTL ? 'إنشاء تنبيه سعر' : 'Create Price Alert'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Gold Type Info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isRTL ? 'نوع الذهب' : 'Gold Type'}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{goldType}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isRTL ? 'السعر الحالي:' : 'Current Price:'}{' '}
              <span className="font-semibold tabular-nums">{currentPrice} {currency}</span>
            </p>
          </div>

          {/* Alert Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isRTL ? 'نبهني عندما يكون السعر' : 'Alert me when price'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAlertTypeChange('increase')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${alertType === 'increase'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700'
                  }
                `}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">
                  {isRTL ? 'يرتفع' : 'Increases'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleAlertTypeChange('decrease')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${alertType === 'decrease'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'
                  }
                `}
              >
                <TrendingDown className="h-5 w-5" />
                <span className="font-medium">
                  {isRTL ? 'ينخفض' : 'Decreases'}
                </span>
              </button>
            </div>
            {alertType && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {alertType === 'increase'
                  ? isRTL
                    ? `السعر المستهدف يجب أن يكون أكبر من ${currentPrice.toFixed(2)} ${currency}`
                    : `Target price must be greater than ${currentPrice.toFixed(2)} ${currency}`
                  : isRTL
                    ? `السعر المستهدف يجب أن يكون أقل من ${currentPrice.toFixed(2)} ${currency}`
                    : `Target price must be less than ${currentPrice.toFixed(2)} ${currency}`
                }
              </p>
            )}
          </div>

          {/* Target Price Input */}
          {alertType && (
            <div>
              <label htmlFor="targetPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isRTL ? 'السعر المستهدف' : 'Target Price'}
              </label>
              <div className="relative">
                <input
                  id="targetPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={targetPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder={isRTL ? 'أدخل السعر المستهدف' : 'Enter target price'}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    validationError
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  required
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  {currency}
                </span>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                  {validationError}
                </p>
              )}

              {/* Helper Text - Only show if no error */}
              {!validationError && targetPrice && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {alertType === 'increase'
                    ? isRTL
                      ? `سيتم إرسال تنبيه عندما يرتفع السعر إلى ${targetPrice} ${currency} أو أكثر`
                      : `You'll be notified when price reaches ${targetPrice} ${currency} or higher`
                    : isRTL
                      ? `سيتم إرسال تنبيه عندما ينخفض السعر إلى ${targetPrice} ${currency} أو أقل`
                      : `You'll be notified when price drops to ${targetPrice} ${currency} or lower`
                  }
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!alertType || !targetPrice || !!validationError}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500 dark:disabled:text-slate-400 rounded-lg font-medium text-white transition-colors"
            >
              {isRTL ? 'إنشاء تنبيه' : 'Create Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
