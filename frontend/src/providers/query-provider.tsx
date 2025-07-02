'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children } : { children: React.ReactNode }) {
  const [queryClient] = useState(()=>{
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
        }
      }
    })
  })
  return (
  <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTool은 개발중에만 */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
  )
}