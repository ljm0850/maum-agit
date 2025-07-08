'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Sidebar from '@/src/components/navigation/Sidebar';

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const handleHoverChange = (expanded: boolean) => setIsSidebarExpanded(expanded);

  return (
        <QueryClientProvider client={queryClient}>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar 
              isExpanded={isSidebarExpanded} 
              onToggle={toggleSidebar} 
              onHoverChange={handleHoverChange} 
            />
            <main style={{ marginLeft: isSidebarExpanded ? '200px' : '60px', transition: 'margin-left 0.3s ease' }}>
              {children}
            </main>
          </div>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
  );
}