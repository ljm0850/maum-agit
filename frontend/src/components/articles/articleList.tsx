'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyPostList, Post } from '@/src/lib/api';
import ArticleItem from './articleListItem';
import ArticleDetailModal from './articleDetailModal';
// import { usePathname } from 'next/navigation';

export default function ArticleList(){
  // 페이지네이션 파라미터
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);

  const { data: articles, isLoading, isError } = useQuery<Post[]>({
    queryKey: ['articles', currentPage, limit, currentTag],
    queryFn:()=>getMyPostList(currentPage, limit, currentTag),
    staleTime: 1000 * 60 * 5,
  })

  // 게시글 디테일 모달
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const handleOpenDetailModal = (postId: string) => {
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPostId(null);
  };



  // 로딩중
  if (isLoading){
    return (
      <div>
        <p>게시물 로딩 중...</p>
      </div>
    )}
  // 게시물 불러오기 실패
  if (isError) {
    return (
      <div>
        <p>글 목록을 불러오는데 실패했습니다.</p>
      </div>
    )
  }
  // 게시글이 없을 때
  if (!articles || articles.length === 0){
    return (
      <div>아직 게시글이 없습니다.</div>
    )
  }

  return (
    <div>
      <h1>내 게시글 목록</h1>
      <div>
      {articles.map((article)=> (
        // <ArticleItem key={article.id} articleItem={article}></ArticleItem>
        <div key={article.id}>

        <h2 
              onClick={() => handleOpenDetailModal(article.id)} // 클릭 시 해당 게시글 ID로 상세 모달 열기
              style={{ fontSize: '1.5em', marginBottom: '10px', color: '#333', cursor: 'pointer' }} // 커서 포인터 추가
              >
              {article.title}
            </h2>
        </div>
      ))}
      </div>
      


      <ArticleDetailModal isOpen={isDetailModalOpen} 
        onClose={handleCloseDetailModal} 
        postId={selectedPostId} />
    </div>
  )
}