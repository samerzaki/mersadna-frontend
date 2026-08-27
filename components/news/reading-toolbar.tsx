'use client';

import { Plus, Minus, BookOpen, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface ReadingToolbarProps {
  fontSize: number;
  isReadingMode: boolean;
  canIncrease: boolean;
  canDecrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onToggleReadingMode: () => void;
}

function ToolbarButton({
  onClick,
  disabled,
  active,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'p-2.5 rounded-lg transition-all duration-200',
        'text-slate-600 dark:text-slate-300',
        'hover:bg-slate-100 dark:hover:bg-slate-700',
        'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        active && 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
      )}
    >
      {children}
    </button>
  );
}

export function ReadingToolbar({
  fontSize,
  isReadingMode,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
  onToggleReadingMode,
}: ReadingToolbarProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const buttons = (
    <>
      <ToolbarButton
        onClick={onIncrease}
        disabled={!canIncrease}
        label={isRTL ? 'تكبير الخط' : 'Increase font size'}
      >
        <Plus className="w-5 h-5" />
      </ToolbarButton>

      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center select-none">
        {fontSize}
      </div>

      <ToolbarButton
        onClick={onDecrease}
        disabled={!canDecrease}
        label={isRTL ? 'تصغير الخط' : 'Decrease font size'}
      >
        <Minus className="w-5 h-5" />
      </ToolbarButton>

      <div className="w-full h-px bg-slate-200 dark:bg-slate-700 md:block hidden" />
      <div className="h-full w-px bg-slate-200 dark:bg-slate-700 md:hidden block" />

      <ToolbarButton
        onClick={onToggleReadingMode}
        active={isReadingMode}
        label={isRTL ? (isReadingMode ? 'إغلاق وضع القراءة' : 'وضع القراءة') : (isReadingMode ? 'Exit reading mode' : 'Reading mode')}
      >
        {isReadingMode ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
      </ToolbarButton>
    </>
  );

  return (
    <>
      {/* Desktop: fixed vertical sidebar */}
      <div
        className={cn(
          'hidden md:flex fixed top-1/2 -translate-y-1/2 z-[60]',
          'flex-col items-center gap-1 p-2',
          'bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm',
          'rounded-xl shadow-lg border border-slate-200 dark:border-slate-700',
          isRTL ? 'left-4' : 'right-4'
        )}
      >
        {buttons}
      </div>

      {/* Mobile: fixed horizontal bottom bar */}
      <div
        className={cn(
          'md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-[60]',
          'flex flex-row items-center gap-1 p-1.5',
          'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm',
          'rounded-full shadow-lg border border-slate-200 dark:border-slate-700'
        )}
      >
        {buttons}
      </div>
    </>
  );
}
