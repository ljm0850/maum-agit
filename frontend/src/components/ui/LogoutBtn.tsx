'use client'; // 클라이언트 컴포넌트임을 명시

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/src/stores/authStore';
// css
import Button from 'react-bootstrap/Button';

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state)=>state.logout);
  
  const handleLogout = () => {
    // localStorage.removeItem('accessToken');
    logout();
    queryClient.clear(); // React Query 캐시 초기화
    router.replace('/'); 
  };

  if (isLoggedIn){
    return (
      <div>
        <Button onClick={handleLogout} variant="outline-dark">로그아웃</Button>
      </div>
    )
  }
  return (
    <div>
    </div>
  )
}