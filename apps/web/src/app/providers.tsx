'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a stable QueryClient instance
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // These match our Orval configuration
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
          retry: 3,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Dev tools for debugging React Query */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 