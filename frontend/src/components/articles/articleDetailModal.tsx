'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyPostById } from '@/src/lib/api';
import { Post } from '@/src/lib/api';
import { useTempPostStore } from '@/src/stores/postStore';

interface ArticleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  onEditRequest: () => void;
}

export default function ArticleDetailModal({ isOpen, onClose, postId, onEditRequest}: ArticleDetailModalProps ){
  // 글 수정 
  const { setSelectedPost, clearSelectedPost } = useTempPostStore(); 
  
  const { data:post, isLoading, isError, error} = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: ()=>{
      if (!postId) throw new Error("게시글 id가 필요합니다.");
      return getMyPostById(postId);
    },
    enabled: !!postId&& isOpen, // postId가 있고 모달이 열리면 실행
    staleTime: 1000 * 60 * 5
  })
  // React.useEffect(()=>{
  //   if (!isOpen) {
  //     clearSelectedPost();
  //   }
  // },[isOpen, clearSelectedPost])
  
  if (!isOpen || !postId) return null;
  if (isLoading) return null;
  if (isError) {
    alert(`에러가 발생했습니다. : ${error.message}`)
    return null;
  }
  if (!post){
    alert('게시글을 찾을 수 없습니다.')
    return null;
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '600px', // 모달 너비 조정
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'none', border: 'none', fontSize: '1.5em',
            cursor: 'pointer', color: '#555'
          }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: '15px', textAlign: 'center', fontSize: '1.8em', color: '#333' }}>{post.title}</h2>
        <div style={{ fontSize: '0.9em', color: '#777', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <p>작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
        </div>
        
        {/* 순화 버전 */}
        {post.purifiedContent && (
          <div style={{ lineHeight: '1.8', color: '#444', marginBottom: '20px', border: '1px dashed #ccc', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            순화 내용 : {post.purifiedContent}
          </div>
        )}

        {/* 글 내용 */}
        <div style={{ lineHeight: '1.8', color: '#444' }}>
          <div dangerouslySetInnerHTML={{ __html: post.originalContent }} />
        </div>
      </div>
      <button
          onClick={() => {
            if (post) { // 게시글 데이터가 있을 때만
              setSelectedPost(post); // Zustand에 현재 Post 객체 저장
            }
            onClose(); // 상세 모달 닫기
            onEditRequest(); // 부모에게 폼 모달 열기를 요청
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          수정하기
        </button>


    </div>
  );
}