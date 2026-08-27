// Loading Skeleton Component - Reusable loading placeholders

export function LoadingSkeleton({ type = 'card' }: { type?: 'card' | 'table' }) {
  if (type === 'table') {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="h-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
      <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4" />
      <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
    </div>
  );
}
