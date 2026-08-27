'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface NewsCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured';
}

export function NewsCardSkeleton({ variant = 'default' }: NewsCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <Skeleton className="aspect-[16/9] w-full" />
      </div>
    );
  }

  // Default variant
  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

interface NewsListSkeletonProps {
  count?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export function NewsListSkeleton({ count = 6, variant = 'default' }: NewsListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} variant={variant} />
      ))}
    </>
  );
}
