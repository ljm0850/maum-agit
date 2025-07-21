'use client';

// import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyPostById } from '@/src/lib/api';
import { Post } from '@/src/lib/api';

interface ArticleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
}

export default function ArticleDetailModal({ isOpen, onClose, postId}: ArticleDetailModalProps ){
  const { data:post, isLoading, isError, error} = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: ()=>{
      if (!postId) throw new Error("게시글 id가 필요합니다.");
      return getMyPostById(postId);
    },
    enabled: !!postId&& isOpen, // postId가 있고 모달이 열리면 실행
    staleTime: 1000 * 60 * 5
  })
  
  // if (!isOpen || !postId) return null;
  // if (isLoading) return <div>로딩중입니다.</div>
  // if (isError) return <div>에러가 발생했습니다. : {error?.message}</div>
  // if (!post) return <div>게시글을 찾을 수 없습니다.</div>

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
    </div>
  );
}