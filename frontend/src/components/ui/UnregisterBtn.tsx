'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { unregister } from '@/src/lib/api';
import { useMutation } from '@tanstack/react-query';

export default function UnregisterButton() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  useEffect(()=>{
    setIsClient(true);
  },[]);

  const isLoggedIn = isClient && !!localStorage.getItem('accessToken');
  
  const unregisterMutaion = useMutation({
    mutationFn:unregister,
    onSuccess:()=> {
      alert("회원 탈퇴되었습니다.");
    }
  })


  const handleUnregister = () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까? \n 회원탈퇴시 작성한 글은 모두 삭제됩니다.")){
      unregisterMutaion.mutate();
      localStorage.removeItem('accessToken'); 
      queryClient.clear(); // React Query 캐시 초기화
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