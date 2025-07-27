'use client';

import React, { useState, useEffect } from 'react';
import { PostFormDto } from '@/src/lib/api'; 
import { useTempPostStore } from '@/src/stores/postStore'; 
import { useCreatePostMutation, useUpdatePostMutation } from '@/src/hooks/postMutaions';

interface PostFormModalProps {
  isOpen: boolean; 
  onClose: () => void; 
}

export default function ArticleFormModal({ isOpen, onClose }: PostFormModalProps) {
  // 데이터
  const { 
    tempTitle, tempContent, setTempTitle, setTempContent, clearTempPost,  // 임시 데이터(글 쓰다 실수로 종료시)
    selectedPost, clearSelectedPost, // 글 수정시 기존 데이터
  } = useTempPostStore();

  // 폼 입력 필드를 위한 로컬 상태
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false); // 글 작성|수정 후 버튼 막는 용도
  const isEditMode = !!selectedPost;  // 글 수정인지 체크용
  
  // (모달이 열릴 때|initialPost가 변경될 때) 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (selectedPost) { // 글 수정
        setFormTitle(selectedPost.title);
        setFormContent(selectedPost.originalContent);
      } else { // 글작성, 작성중인 데이터가 있으면 불러오기
        setFormTitle(tempTitle); 
        setFormContent(tempContent); 
      }
    } else { // 모달이 닫힐 때 폼 초기화
        setFormTitle('');
        setFormContent('');
        clearSelectedPost();
    }
  }, [isOpen, selectedPost, tempTitle, tempContent, setFormTitle, setFormContent, clearSelectedPost]);

  // 글 생성|수정 Mutation
  // const { mutate: createPost, isPending: isCreating } = useCreatePostMutation();
  const { mutate: createPost } = useCreatePostMutation();
  const { mutate: updatePost } = useUpdatePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 

    const postData: PostFormDto = { title: formTitle, originalContent: formContent }; 

    if (isEditMode) { // 글 수정모드면
      updatePost(
        {postId: selectedPost.id, postData:postData},
        { onSuccess:()=>{
          clearSelectedPost();
          onClose();
          setIsSubmitting(false);
          alert('글이 성공적으로 수정되었습니다.');
      }})
    } else { // 없으면 생성 모드
      createPost(
        postData,
        { onSuccess: ()=>{
          clearTempPost();
          onClose();
          setIsSubmitting(false);
          alert('글이 성공적으로 작성되었습니다.');
        }
      })
    }
  };

  if (!isOpen) return null; 

  return (
    <div>
      <div>
        <button onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
          {isEditMode ? '게시글 수정' : '새 게시글 작성'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value); 
                if (!isEditMode) { // 생성 모드일 때만 임시 저장
                    setTempTitle(e.target.value);
                } 
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={formContent} 
              onChange={(e) => {
                setFormContent(e.target.value); 
                if (!isEditMode) { // 생성 모드일 때만 Zustand에 임시 저장
                    setTempContent(e.target.value);
                }
              }}
              required
              rows={10}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting} 
          >
            {isSubmitting ? '저장 중...' : (isEditMode ? '수정하기' : '작성하기')}
          </button>
        </form>
      </div>
    </div>
  );
}