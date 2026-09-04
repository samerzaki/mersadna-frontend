'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface NewsCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured';
}

export function NewsCardSkeleton({ variant = 'default' }: NewsCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-2.5 rounded-xl">
        <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="card-surface overflow-hidden">
        <Skeleton className="h-[320px] w-full" />
      </div>
    );
  }

  // Default variant
  return (
    <div className="card-surface overflow-hidden">
      <Skeleton className="h-[200px] w-full" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
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
