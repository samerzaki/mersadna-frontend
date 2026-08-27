'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Auto-refresh wrapper component
 *
 * Triggers server-side re-rendering every 60 seconds using router.refresh()
 * This causes the server component to re-fetch data from the API on the server
 * and send updated HTML to the browser (no JSON visible in network tab)
 *
 * @param children - Server component(s) to wrap
 */
export function AutoRefreshWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Set up interval to refresh server components every 60 seconds
    const interval = setInterval(() => {
      router.refresh(); // Triggers server re-render
    }, 60000); // 60 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [router]);

  // Invisible wrapper - just renders children
  return <>{children}</>;
}
