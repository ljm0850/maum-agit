export class PostListItemDto {
  id: string; // 게시물 고유 ID
  title: string; // 게시물 제목
  purifiedContent?: string;
  createdAt: Date;
  updatedAt: Date;

  tags?: { id: string; name: string }[];
}
