'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Sidebar from '@/src/components/navigation/Sidebar';
import { useRouter, usePathname } from 'next/navigation'; 

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // 사이드바 토글
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const handleHoverChange = (expanded: boolean) => setIsSidebarExpanded(expanded);
  
  // 로그인 안된 상태로 다른 페이지 접근시 리다이렉트
  const router = useRouter();
  const pathname = usePathname();
  const pathNameArr = pathname.split('/');
  const isLoginPage = pathname === '/';
  const isAuthCallbackPage = pathname.startsWith('/auth/callback');
  useEffect(()=>{
    const allowRoutes = ['/']; // 로그인 없이 사용가능한 페이지 목록
    const isAllowRoutes = allowRoutes.some(route => pathNameArr.includes(route));
    const accessToken = localStorage.getItem('accessToken');
    // 토큰 없고, 비로그인 사용 불가 페이지 일때
    if (!accessToken && !isAllowRoutes) {
      alert('로그인이 필요한 서비스입니다.');
      router.replace('');
      return
    }
    // 이미 로그인 되어 있는데 로그인 관련 페이지 이동시
    if (accessToken && (isLoginPage||isAuthCallbackPage)){
      alert('로그인 되었습니다.')
      router.replace('/posts');
      return;
    }
  },[pathname, router]);

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