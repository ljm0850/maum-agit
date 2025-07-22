'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, updatePost, Post, CreatePostDto, UpdatePostDto } from '@/src/lib/api'; 
import { useTempPostStore } from '@/src/stores/postStore'; 

interface PostFormModalProps {
  isOpen: boolean; 
  onClose: () => void; 
}

export default function ArticleFormModal({ isOpen, onClose }: PostFormModalProps) {
  const queryClient = useQueryClient();
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
    console.log("useEffect 실행됨. isOpen:", isOpen, "selectedPost:", selectedPost);
    if (isOpen) {
      if (selectedPost) { // 글 수정
        console.log("글 수정 모드입니다 ㅇㅇ")
        console.log(selectedPost)
        setFormTitle(selectedPost.title);
        setFormContent(selectedPost.originalContent);
        console.log('Set form fields to:', selectedPost!.title, selectedPost!.originalContent);
      } else { // 글작성, 작성중인 데이터가 있으면 불러오기
        setFormTitle(tempTitle); 
        setFormContent(tempContent); 
        console.log('Set form fields to (temp):', tempTitle, tempContent); // ✨ 추가 ✨
      }
    } else { // 모달이 닫힐 때 폼 초기화
        setFormTitle('');
        setFormContent('');
        clearSelectedPost();
        console.log('Cleared form fields.'); // ✨ 추가 ✨
    }
  }, [isOpen, selectedPost, tempTitle, tempContent, setFormTitle, setFormContent, clearSelectedPost]);

  // 글 생성 Mutation
  const createPostMutation = useMutation({
    mutationFn: createPost, 
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ['myPosts'] }); 
      queryClient.invalidateQueries({ queryKey: ['post', newPost.id] });
      clearTempPost();
      onClose(); 
      alert('게시글이 성공적으로 작성되었습니다!');
    },
    onError: (error) => {
      console.error('게시글 생성 실패:', error);
      alert(`게시글 생성 실패: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false); 
    }
  });

  // 글 수정 Mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostDto }) => updatePost(id, data), 
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] }); 
      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.id] }); 
      onClose();
      alert('게시글이 성공적으로 수정되었습니다!');
    },
    onError: (error) => {
      console.error('게시글 수정 실패:', error);
      alert(`게시글 수정 실패: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 

    const postData: CreatePostDto = { title: formTitle, originalContent: formContent }; 

    if (isEditMode) { // 글 수정모드면
      updatePostMutation.mutate({ id: selectedPost.id, data: postData });
    } else { // 없으면 생성 모드
      createPostMutation.mutate(postData);
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