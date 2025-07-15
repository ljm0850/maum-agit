import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // JWT 인증 가드 임포트
import { RequestWithUser } from '../common/interfaces/request-with-user.interface'; // 커스텀 Request 인터페이스 임포트
import { Post as PostEntity } from './post.entity'; // Post 엔티티와 NestJS Post 데코레이터 이름 충돌 방지
import { GetPostsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostListItemDto } from './dto/post-list-item.dto';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name); //디버깅용
  constructor(private readonly postService: PostService) {}

  // 게시글 생성
  @Post() // post 요청
  @UseGuards(JwtAuthGuard) // jwt 요구
  @HttpCode(HttpStatus.CREATED) // 성공시 201 Created 반환
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostEntity> {
    this.logger.log(`Attempting to create a new post by user: ${req.user.id}`); // log에 생성 기록
    const author = req.user;

    try {
      const newPost = await this.postService.createPost(createPostDto, author);
      this.logger.log(`Post created successfully with ID: ${newPost.id}`);
      return newPost; // 생성된 게시물 엔티티를 클라이언트에 반환합니다.
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to create post: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Failed to create post: An unknown error occurred.`,
          error,
        );
      }
      throw error; // 에러를 다시 던져 NestJS의 예외 필터가 처리하도록 합니다.
    }
  }
  // 내 게시글 목록
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyPosts(
    @Query() getPostsDto: GetPostsDto,
    @Req() req: RequestWithUser,
  ): Promise<PostListItemDto[]> {
    const userId = req.user.id; // 로그인된 id
    this.logger.log(
      `Attempting to retrieve posts for user: ${userId} with query: ${JSON.stringify(getPostsDto)}`,
    );
    try {
      const posts = await this.postService.findAllPostsByUserId(
        userId,
        getPostsDto,
      );
      this.logger.log(
        `Successfully retrieved ${posts.length} posts for user: ${userId}`,
      );
      return posts;
    } catch (error) {
      this.logger.error(`Failed to retrieve posts for user ${userId}`, error);
      throw error;
    }
  }

  // 내 게시글 조회
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMyPostById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<PostEntity> {
    const userId = req.user.id;
    this.logger.log(
      `Attempting to retrieve post with ID: ${id} for user: ${userId}`,
    );
    try {
      const post = await this.postService.findPostByIdAndUserId(id, userId);
      if (!post)
        throw new HttpException(
          'Post not found or you do not have permission to access this post',
          HttpStatus.NOT_FOUND,
        );
      this.logger.log(
        `Successfully retrieved post with ID: ${id} for user: ${userId}`,
      );
      return post;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve post by ID: ${id} for user ${userId}`,
      );
      throw error;
    }
  }

  // 글 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = req.user.id;
    this.logger.log(
      `Attempting to delete post with ID: ${id} by user: ${userId}`,
    );
    try {
      await this.postService.deletePost(id, userId);
      this.logger.log(
        `Post with ID: ${id} deleted successfully by user: ${userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to delete post`, error);
      throw error;
    }
  }
  // 글 업데이트
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostEntity> {
    const userId = req.user.id;
    this.logger.log(
      `Attempting to update post with ID: ${id} by user: ${userId}`,
    );
    this.logger.debug(`Update data: ${JSON.stringify(updatePostDto)}`);
    try {
      const updatedPost = await this.postService.updatePost(
        id,
        userId,
        updatePostDto,
      );
      this.logger.log(
        `Post with ID: ${id} updated successfully by user: ${userId}`,
      );
      return updatedPost;
    } catch (error) {
      this.logger.error(`Failed to update post`, error);
      throw error;
    }
  }
}
