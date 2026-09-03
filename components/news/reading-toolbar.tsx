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
        'text-muted',
        'hover:bg-hover',
        'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        active && 'bg-gold-soft text-gold'
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

      <div className="num text-xs font-medium text-muted text-center select-none">
        {fontSize}
      </div>

      <ToolbarButton
        onClick={onDecrease}
        disabled={!canDecrease}
        label={isRTL ? 'تصغير الخط' : 'Decrease font size'}
      >
        <Minus className="w-5 h-5" />
      </ToolbarButton>

      <div className="w-full h-px bg-line2 md:block hidden" />
      <div className="h-full w-px bg-line2 md:hidden block" />

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
          'bg-panel/90 backdrop-blur-sm',
          'rounded-xl shadow-card border border-line',
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
          'bg-panel/90 backdrop-blur-sm',
          'rounded-full shadow-card border border-line'
        )}
      >
        {buttons}
      </div>
    </>
  );
}
