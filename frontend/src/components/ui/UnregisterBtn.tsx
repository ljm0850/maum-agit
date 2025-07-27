'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserUnregister } from '@/src/hooks/userMutaions';

export default function UnregisterButton() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(()=>{
    setIsClient(true);
  },[]);

  const isLoggedIn = isClient && !!localStorage.getItem('accessToken');
  
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