'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMyInfo, UserInfo } from '@/src/lib/api';
import { useQueryClient } from '@tanstack/react-query';
export default function LoginCallbackPage(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [errMessage, setErrMessage] = useState<string|null>(null);
  useEffect(()=>{
    const checkAccessToken = async () =>{
      const accessToken = searchParams.get('accessToken');
      if (!accessToken){
        setErrMessage('잘못된 로그인입니다.');
      } else {
        try {
          localStorage.setItem('accessToken', accessToken); // accessToken localStorage 저장
          const userInfo: UserInfo = await getMyInfo(); // 유저 정보는 localStorage의 accessToken 기반으로 가져옴
          queryClient.setQueryData(['user','me'],userInfo); // React Query에 유저정보 저장
          router.replace('/posts'); // posts로 리다이렉트
        } catch(err:any) {
          console.log(err);
          setErrMessage('죄송합니다. 유저정보를 가져오지 못했습니다.');
          localStorage.removeItem('accessToken'); 
        } finally {
          setIsLoading(false);
        }
      }
    }
    checkAccessToken();
  })
  if (errMessage) {
    return (
      <div>
        {errMessage}
      </div>
    )
  }
  if (isLoading){
    return (
     <div>
        <p>로그인 중입니다. 잠시만 기다려주세요...</p>
      </div>
    )
  }
}