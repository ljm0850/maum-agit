// 사용 안하는 페이지
'use client'

import { useQuery } from "@tanstack/react-query";
import { getMyPostById, Post } from "@/src/lib/api";

export default function ArticleDetail( {id} : {id:string}) {
  const { data: article, isLoading } = useQuery<Post>({
    queryKey: ['article', id],
    queryFn:()=>getMyPostById(id),
    staleTime: 1000 * 60 * 5,
  })
  // 로딩중
  if (isLoading) {
    return (
      <div>
        {id}번 게시글을 로딩중입니다.
      </div>
    )
  }
  // 문제 없음
  if (article) {
    return (
      <div>
        <div>제목 : {article.title}</div>
        <div>내용 : {article.originalContent}</div>
        {article.purifiedContent&&( <div>순화 내용 :  {article.purifiedContent}</div>)}
        <div>{article.createdAt}</div>
        <div></div>
      </div>
    )
  }
}