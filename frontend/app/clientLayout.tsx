'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/src/components/navigation/Sidebar';
import { useAuthStore } from '@/src/stores/authStore';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // 사이드바 확장/축소 상태 관리
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const handleHoverChange = (expanded: boolean) => setIsSidebarExpanded(expanded);
  
  // 현재 경로 파악
  const router = useRouter();
  const pathname = usePathname(); // 현재 URL 경로 ('/posts')
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isHydrated = useAuthStore((state) => state._has ? true : false);

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const PROTECTED_ROUTES_SEGMENTS = ['posts'];
    const isProtectedRoute = PROTECTED_ROUTES_SEGMENTS.some(segment => pathSegments.includes(segment));
    
    if (!isHydrated) {
      return; // 하이드레이션이 완료될 때까지 함수 실행을 중단합니다.
    }

    // 로그인 없이 접근시
    if (!isLoggedIn && isProtectedRoute) {
      alert('로그인이 필요한 서비스입니다.');
      router.replace('/');
      return;
    }

  }, [isLoggedIn, pathname, router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        isExpanded={isSidebarExpanded}  
        onToggle={toggleSidebar} 
        onHoverChange={handleHoverChange} 
      />
      <main style={{ marginLeft: isSidebarExpanded ? '200px' : '60px', transition: 'margin-left 0.3s ease' }}>{children}</main>
    </div>
  );
}