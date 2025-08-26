// app/auth/callback/page.tsx
import { Suspense } from 'react';
import AuthCallbackHandler from './AuthCallbackHandler';

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={<div>로그인 처리 중...</div>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}