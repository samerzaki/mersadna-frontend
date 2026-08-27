'use client';

import { NewsCategory, NewsCategoryInfo } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface NewsFiltersProps {
  activeCategory?: NewsCategory;
  onCategoryChange: (category?: NewsCategory) => void;
  categories: NewsCategoryInfo[];
  isLoading?: boolean;
}

export function NewsFilters({ activeCategory, onCategoryChange, categories, isLoading }: NewsFiltersProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-2 min-w-max">
        {/* All category button */}
        <button
          onClick={() => onCategoryChange(undefined)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
            !activeCategory
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          {isRTL ? 'الكل' : 'All'}
        </button>

        {/* Loading skeleton */}
        {isLoading && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse w-20 h-9"
              />
            ))}
          </>
        )}

        {/* Category buttons */}
        {!isLoading && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              activeCategory === category.slug
                ? `${category.color} ${category.darkColor} shadow-md`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {isRTL ? category.nameAr : category.nameEn}
          </button>
        ))}
      </div>
    </div>
  );
}
