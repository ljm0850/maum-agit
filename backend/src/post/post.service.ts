import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';
import { Image } from './image/image.entity';
import { Tag } from './tag/tag.entity';
import { PostTag } from './post-tag/post-tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(
    // 각 엔티티의 Repository를 주입합니다.
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(PostTag)
    private postTagsRepository: Repository<PostTag>,
  ) {}
  async createPost(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const { title, originalContent, purifiedContent, images, tags } =
      createPostDto;

    const newPost = this.postsRepository.create({
      title,
      originalContent,
      purifiedContent,
      user: author,
      userId: author.id,
    });
    await this.postsRepository.save(newPost);
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
}
