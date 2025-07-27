'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost,updatePost,deletePost,PostFormDto } from "../lib/api";

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({queryKey:['articles']});
      queryClient.invalidateQueries({ queryKey: ['post', newPost.id] });
    },
    onError: (error) => {
      console.log('게시글 생성 중 오류가 발생했습니다. : ', error.message);
    }
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, postData}:{postId:string, postData: PostFormDto })=>updatePost(postId, postData),  // 인자로 객체를 하나밖에 못받기에 { postId, postData} 객체 형식을 받음
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.id] });
    },
    onError: (error) => {
      console.log('게시글 수정 중 오류가 발생했습니다. : ', error.message);
    }
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: ()=> {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  })
}