import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Image } from './image/image.entity';
import { Tag } from './tag/tag.entity';
import { PostTag } from './post-tag/post-tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/user.entity';
import { GetPostsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    // 각 엔티티의 Repository를 주입합니다.
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(PostTag)
    private postTagsRepository: Repository<PostTag>,
  ) {}
  // 글 쓰기
  async createPost(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const { title, originalContent, purifiedContent, images, tags } =
      createPostDto;

    const newPost = this.postRepository.create({
      title,
      originalContent,
      purifiedContent,
      user: author,
      userId: author.id,
    });
    await this.postRepository.save(newPost);
    // 이미지 처리
    if (images && images.length > 0) {
      const imageEntities = images.map((imgDto) =>
        this.imagesRepository.create({
          ...imgDto,
          post: newPost,
          postId: newPost.id,
        }),
      );
      await this.imagesRepository.save(imageEntities);
    }
    // 태그 처리
    if (tags && tags.length > 0) {
      const postTagEntities: PostTag[] = [];
      for (const tagDto of tags) {
        // 기존 태그 찾아본 후 없으면 생성
        let tag = await this.tagsRepository.findOne({
          where: { name: tagDto.name },
        });
        if (!tag) {
          tag = this.tagsRepository.create({ name: tagDto.name });
          await this.tagsRepository.save(tag);
        }
        // postTag 중간 테이블 처리
        const postTag = this.postTagsRepository.create({
          post: newPost,
          postId: newPost.id,
          tag: tag,
          tagId: tag.id,
        });
        postTagEntities.push(postTag); // 배열에 추가
      }
      await this.postTagsRepository.save(postTagEntities); // 저장
    }
    return newPost;
  }
  // 내 글 목록
  async findAllPostsByUserId(
    userId: string,
    getPostsDto: GetPostsDto,
  ): Promise<Post[]> {
    const { page, limit, tag } = getPostsDto;
    const skip = ((page ?? 1) - 1) * (limit ?? 10);
    const queryBuilder = this.postRepository
      .createQueryBuilder('post') // 'post'라는 별칭으로 Post엔티티 쿼리 서칭
      .leftJoinAndSelect('post.user', 'user') // Post와 연관된 User(작성자) 정보를 함께 가져옴
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect('post.postTags', 'postTag')
      .leftJoinAndSelect('postTag.tag', 'tag')
      .where('post.userId = :userId', { userId }) // :userId를 하두고 userId 객체를 내보내는건 SQL 인젝션 방지
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);
    if (tag) {
      queryBuilder.andWhere('tag.name = :tag', { tag });
    }
    return queryBuilder.getMany();
  }
  // 내 글 조회
  async findPostByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'images', 'postTags', 'postTags.tag'],
    });
  }
  // 글 삭제
  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
      relations: ['images', 'postTags'],
    });
    if (!post)
      throw new HttpException(
        'Post not found or you do not have permission to delete this post',
        HttpStatus.NOT_FOUND,
      );
    await this.postRepository.remove(post);
    this.logger.log(
      `Post ${postId} and its related data deleted successfully (via cascade).`,
    );
  }
  // 글 수정
  async updatePost(
    postId: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.findPostByIdAndUserId(postId, userId);
    if (!post)
      throw new HttpException(
        'Post not found or you do not have permission to update this post',
        HttpStatus.NOT_FOUND,
      );
    Object.assign(post, updatePostDto); //객체 프로퍼티 덮어씌우기
    const updatedPost = await this.postRepository.save(post);
    return updatedPost;
  }
}
