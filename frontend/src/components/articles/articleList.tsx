'use client'

import { useState, useRef, useEffect } from 'react';
import ArticleDetailModal from './articleDetailModal';
import ArticleFormModal from './articleFormModal';
import { useMyPostInfiniteQuery } from '@/src/hooks/postQueries';
import ArticleItem from './articleListItem';
// css
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

export default function ArticleList(){
  // 페이지네이션 파라미터
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);

  const lastElementRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError,} = useMyPostInfiniteQuery(limit,currentTag);
  const articles = data?.pages.flatMap(page => page) || [];

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

  useEffect(() => {
    if (isFetchingNextPage) return;
    if (!lastElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    const currentElement = lastElementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
      <Container>
        <h1> 게시글이 없습니다.</h1>
        <Button variant="outline-info" onClick={handleOpenCreateModal}>새 글 작성</Button>
      </Container>
    )
  }

  return (
    <div>
      <Container>
      <Button variant="outline-success" onClick={handleOpenCreateModal}>새 글 작성</Button>
      <h1>내 게시글 목록</h1>
        <Row>
          {articles.map((article, index) => {
            const isLastElement = index === articles.length - 1;
            return (
              <Col key={article.id} md={6} sm={12} className="mb-4">
                <div
                  onClick={() => handleOpenDetailModal(article.id)}
                  style={{ cursor: 'pointer' }}
                  ref={isLastElement ? lastElementRef : null}
                >
                  <ArticleItem article={article} />
                </div>
              </Col>
            );
          })}
        </Row>
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