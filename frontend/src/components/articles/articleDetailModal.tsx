'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTempPostStore } from '@/src/stores/postStore';
import { useDeletePostMutation } from '@/src/hooks/postMutaions';
import { usePostDetailQuery } from '@/src/hooks/postQueries';
// css
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ArticleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  onEditRequest: () => void;
}

export default function ArticleDetailModal({ isOpen, onClose, postId, onEditRequest}: ArticleDetailModalProps ){
  const queryClient = useQueryClient();
  // 글 작성|수정
  const { setSelectedPost, clearSelectedPost } = useTempPostStore(); 
  
  const { data:post, isLoading, isError, error } = usePostDetailQuery(postId,isOpen);
  const { mutate:deletePost, isPending:isDeleting } = useDeletePostMutation();

  const handleUpdatePost = () => {
    if (post) setSelectedPost(post);
    onClose();
    onEditRequest();
  }

  const handleDeletePost = () => {
    if (window.confirm('글을 삭제하시겠습니까?')){
      if (post?.id) {
        deletePost(post.id,{onSuccess:()=>{
          setTimeout(()=>{
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            clearSelectedPost();
            alert('글이 삭제되었습니다.');
            onClose();
          },50)
        }})
      }
    }
  }

  if (!isOpen || !postId) return null;
  if (isLoading) return null;
  if (isError) {
    alert(`에러가 발생했습니다. : ${error.message}`)
    return null;
  }
  if (!post){
    alert('게시글을 찾을 수 없습니다.')
    return null;
  }

  return (
    <Modal show={isOpen} onHide={onClose} backdrop="static">
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>{post.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{post.originalContent}</p>
        {post.purifiedContent && (
          <div>
            <Modal.Title>순화 버전</Modal.Title>
            {post.purifiedContent}
          </div>
          
        )}
      </Modal.Body>

      <Modal.Footer>
        <p>작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
        <hr />
        <Button variant="secondary" onClick={handleDeletePost}>글 삭제</Button>
        <Button variant="primary" onClick={handleUpdatePost}>글 수정</Button>
      </Modal.Footer>
    </Modal>
  );
}