'use client';

import { useQuery } from "@tanstack/react-query";
import { getMyPostList,getMyPostById,Post } from "../lib/api";

const freshTime = 1000 * 60 * 5 // 5분

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