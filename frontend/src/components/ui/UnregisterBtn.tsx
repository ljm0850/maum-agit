'use client';

// import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useState } from 'react';
import { useUserUnregister } from '@/src/hooks/userMutaions';
import { useAuthStore } from '@/src/stores/authStore';

export default function UnregisterButton() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  const { mutate:userUnregist}  = useUserUnregister()

  const handleUnregister = () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까? \n 회원탈퇴시 작성한 글은 모두 삭제됩니다.")){
      userUnregist();
      router.replace('/'); 
    }
  };

  if (isLoggedIn){
    return (
      <div>
        <button onClick={handleUnregister}>회원탈퇴</button>
      </div>
    )
  }
  return (
    <div>
    </div>
  )

}