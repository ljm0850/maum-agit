'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const queryClient = new QueryClient();

interface QueryClientWrapperProps {
  children: React.ReactNode;
}

export default function QueryClientWrapper({ children }: QueryClientWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 React Query Devtools를 표기 */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}