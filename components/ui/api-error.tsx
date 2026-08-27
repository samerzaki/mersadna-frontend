// API Error Component - Reusable error display with retry

export function ApiError({
  error,
  retry
}: {
  error: Error;
  retry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
      <p className="text-sm text-red-800 dark:text-red-200">
        ⚠️ {error.message || 'فشل تحميل البيانات'}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
