'use client';

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMyPostList,getMyPostById,Post } from "../lib/api";

const freshTime = 1000 * 60 * 5 // 5분

// 현재 사용 안하는 쿼리
export const useMyPostListQuery = ( currentPage:number, limit:number, currentTag:string|undefined) => {
  return useQuery<Post[]>({
    queryKey: ['articles',currentPage,limit,currentTag],
    queryFn: ()=>getMyPostList(currentPage,limit,currentTag),
    staleTime: freshTime,
  })
}

export const usePostDetailQuery = (postId:string|null, enabled:boolean) => {
  return useQuery<Post>({
    queryKey: ['post',postId],
    queryFn: ()=> getMyPostById(postId as string), // postId가 null일땐 enabled에 의해 작동 x
    enabled: enabled&&!!postId,
    staleTime: freshTime
  })
}

export const useMyPostInfiniteQuery = (limit: number, currentTag?: string) => {
  return useInfiniteQuery<Post[]>({
    queryKey: ['articles', 'infinite', limit, currentTag],
    queryFn: async ({ pageParam = 1 }) => {
      const pageNumber = pageParam as number;
      const res = await getMyPostList(pageNumber, limit, currentTag);
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length + 1 : undefined;
    },
    staleTime: freshTime,
  });
};