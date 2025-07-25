'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyPostList, Post } from '@/src/lib/api';
// import ArticleItem from './articleListItem';
import ArticleDetailModal from './articleDetailModal';
// import { usePathname } from 'next/navigation';
// import { useTempPostStore } from '@/src/stores/postStore';
import ArticleFormModal from './articleFormModal';

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

  // 글 작성|수정 모달 관련
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const handleOpenCreateModal = () => { 
    setIsFormModalOpen(true);
  };
  const handleCloseFormModal = () => { setIsFormModalOpen(false);};
  const handleEditRequestFromDetail = () => {
    setIsDetailModalOpen(false); // 상세 모달 닫기
    setIsFormModalOpen(true);    // 폼 모달 열기
  };

  // 게시글 디테일 모달 관련
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const handleOpenDetailModal = (postId:string) => {
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedPostId(null);
    setIsDetailModalOpen(false);
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
      <div>
        <div> 게시글이 없습니다.</div>
        <button onClick={handleOpenCreateModal}> 글 작성 </button>
        <ArticleFormModal
        isOpen={isFormModalOpen} 
        onClose={handleCloseFormModal} 
      />
        </div>
    )
  }

  return (
    <div>
      <button onClick={handleOpenCreateModal}> 글 작성 </button>
      <h1>내 게시글 목록</h1>
      <div>
      {articles.map((article)=> (
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

      <ArticleDetailModal
        isOpen={isDetailModalOpen} 
        onClose={handleCloseDetailModal} 
        postId={selectedPostId}
        onEditRequest={handleEditRequestFromDetail}
        />

        <ArticleFormModal
        isOpen={isFormModalOpen} 
        onClose={handleCloseFormModal} 
      />
    </div>
  )
}