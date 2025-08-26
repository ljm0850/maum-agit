'use client';

import { useAuthStore } from "@/src/stores/authStore";
import UnregisterButton from "@/src/components/ui/UnregisterBtn";

export default function MyProfile() {
  const userData = useAuthStore.getState().user;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) return <div>로그인이 필요한 서비스입니다.</div>
  
  return (
    <div>
      <div>{userData?.username}님 안녕하세요</div>
      <div>회원가입일 : {userData?.createdAt}</div>
      <UnregisterButton />
    </div>
  );
}
