'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMyInfo, UserInfo } from '@/src/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/src/stores/authStore';

export default function LoginCallbackPage(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [errMessage, setErrMessage] = useState<string|null>(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state)=> state.login);
  const logout = useAuthStore((state)=> state.logout);
  const setToken = useAuthStore((state)=>state.setToken);

  useEffect(()=>{
    if (isLoggedIn) return
    const checkAccessToken = async () =>{
      setIsLoading(true);
      const accessToken = searchParams.get('accessToken');
      if (!accessToken) {
        setErrMessage('잘못된 로그인입니다: accessToken이 없습니다.');
        logout();
        setIsLoading(false);
        return;
      }
      try {
        setToken(accessToken); // 임시로 저장
        const userInfo: UserInfo = await getMyInfo(); // 유저 정보 가져오기
        if (userInfo.id) {
          login(accessToken, userInfo); // Zustand의 login
          queryClient.setQueryData(['user', 'me'], userInfo); 
          router.replace('/posts'); // posts로 리다이렉트
        } else {
          logout();
        }
      } catch (error) {
        console.error("유저 정보를 가져오는 중 에러 발생:", error);
        setErrMessage('죄송합니다. 유저 정보를 가져오지 못했습니다.');
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    checkAccessToken();
  })

  // useEffect(()=> {
  //   if (isLoggedIn) router.replace('/posts')
  // },[isLoggedIn]
  // )

  if (errMessage) {
    return (
      <div>
        <h2>로그인에 실패하였습니다.</h2>
        <div>{errMessage}</div>
        <button onClick={() => router.push('/')}>홈으로 돌아가기</button>
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
  return null
}