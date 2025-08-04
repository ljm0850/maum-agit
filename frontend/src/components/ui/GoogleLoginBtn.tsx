'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/authStore';

interface GoogleLoginButtonProps {
  backendAuthUrl: string;
}

export default function GoogleLoginButton({ backendAuthUrl }: GoogleLoginButtonProps) {
  const router = useRouter();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const checkGoogleApi = setInterval(() => {
      // window.google 객체가 존재하는지 주기적으로 확인
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        setIsGoogleApiReady(true);
        clearInterval(checkGoogleApi); // API가 준비되면 인터벌 중지
      } else {
        console.log("Waiting for Google Identity Services API...", window.google);
      }
    }, 200); // 200ms 마다 확인
    return () => clearInterval(checkGoogleApi); // 컴포넌트 언마운트 시 인터벌 정리
  }, []); 

  // Google API가 준비되면 버튼 렌더링
  useEffect(() => {
    if (isGoogleApiReady && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: (response) => { 
            console.log('Google Identity Callback Fired (might not be used for direct redirect):', response);
        }
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { 
          theme: "outline", 
          size: "large", 
          text: "continue_with", 
          width: "300", 
        },
        () => {
          console.log("Google button clicked, redirecting to backend auth URL:", backendAuthUrl);
          router.push(backendAuthUrl);
        }
      );
      console.log("Google button render function called.");
    } else if (isGoogleApiReady && !googleButtonRef.current) {
        console.log("Google API ready, but button ref not current.");
    }
  }, [isGoogleApiReady, router, backendAuthUrl]); // isGoogleApiReady가 변경될 때마다 재실행

  if (isLoggedIn) return null
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div ref={googleButtonRef} className="my-4">
        {!isGoogleApiReady && (
          <p className="text-gray-500">Google 로그인 버튼을 로딩 중...</p>
        )}
      </div>
    </div>
  );
}