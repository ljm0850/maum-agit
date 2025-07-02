// src/components/testComponent/UserInfoComponent.tsx
'use client'
import { getMyInfo, UserInfo } from "@/src/lib/api"; // Post는 UserInfoComponent에서 사용되지 않으므로 제거하거나 그대로 둬도 무방합니다.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function UserInfoComponent(){
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery<UserInfo>({
    queryKey: ['user', 'me'],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5, // 5분
    enabled: true,
  });

  console.log("UserInfoComponent rendered"); // 컴포넌트 렌더링 확인용
  console.log("isUserLoading:", isUserLoading);
  console.log("isUserError:", isUserError);
  console.log("userError:", userError);
  console.log("User data:", userData); // 실제 데이터 객체 확인용

  return (
    <div>
      {/* ✨ userData 객체를 직접 렌더링하는 대신, JSON.stringify를 사용하여 문자열로 변환 ✨ */}
      {/* 개발/디버깅 목적으로 객체 전체를 볼 때 유용합니다. */}
      <div>데이터 원본 (디버깅용): <pre>{JSON.stringify(userData, null, 2)}</pre></div>
      {/* <pre> 태그는 JSON 형식을 유지하면서 보기 좋게 표시합니다. */}

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem', width: '100%', maxWidth: '48rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'semibold', color: '#1f2937', marginBottom: '1rem' }}>내 정보</h2>

        {isUserLoading && <p style={{ textAlign: 'center', color: '#4b5563' }}>사용자 정보를 불러오는 중...</p>}
        {isUserError && <p style={{ textAlign: 'center', color: 'red' }}>사용자 정보 로드 오류: {userError?.message}</p>}

        {userData && ( // userData가 존재할 때만 렌더링
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* ✨ 객체의 각 속성에 접근하여 문자열로 렌더링 ✨ */}
            <p><strong style={{ color: '#4a5568' }}>ID:</strong> {userData.id}</p>
            <p><strong style={{ color: '#4a5568' }}>사용자명:</strong> {userData.username}</p>
            <p><strong style={{ color: '#4a5568' }}>이메일:</strong> {userData.email}</p>
            <p><strong style={{ color: '#4a5568' }}>가입일:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            {/* 다른 필요한 정보도 여기에 추가할 수 있습니다. */}
            {/* profileImageUrl은 null일 수 있으므로 조건부 렌더링을 고려합니다. */}
            {userData.profileImageUrl && (
              <p><strong style={{ color: '#4a5568' }}>프로필 이미지:</strong> <img src={userData.profileImageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}