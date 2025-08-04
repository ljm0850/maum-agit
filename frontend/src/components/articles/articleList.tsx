'use client'

import { useState } from 'react';
import ArticleDetailModal from './articleDetailModal';
import ArticleFormModal from './articleFormModal';
import { useMyPostListQuery } from '@/src/hooks/postQueries';
import ArticleItem from './articleListItem';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export default function ArticleList(){
  // 페이지네이션 파라미터
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);

  const { data:articles, isLoading, isError, error} = useMyPostListQuery(currentPage,limit,currentTag);

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
        </div>
    )
  }

  return (
    <div>
      <Container>
      <h1>내 게시글 목록</h1>
        <Row>
      {articles.map((article)=> (
        <Col key={article.id} md={6} sm={12} onClick={()=>handleOpenDetailModal(article.id)}>
          <ArticleItem article={article}/>
        </Col>
        ))}
        </Row>
      <Button variant="info" onClick={handleOpenCreateModal}>새 글 작성</Button>
      </Container>

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