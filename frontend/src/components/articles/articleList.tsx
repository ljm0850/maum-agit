'use client'

import { useQuery } from "@tanstack/react-query";
import { getMyPost,Post } from "@/src/lib/api";

export default function ArticleList(){
  const { data: articleListData } = useQuery<Post>({
    queryKey: ['articles','me'],
    queryFn: getMyPost,
    staleTime: 1000 * 60 * 5,
    enabled: true,
  })
  
  return (
    <div>
      아티클목록
    </div>
  )
}