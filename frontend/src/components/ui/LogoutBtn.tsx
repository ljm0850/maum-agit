'use client'; // 클라이언트 컴포넌트임을 명시

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '@/src/stores/authStore';

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
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    )
  }
  return (
    <div>
    </div>
  )
}