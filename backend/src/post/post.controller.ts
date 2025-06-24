import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // JWT 인증 가드 임포트
import { RequestWithUser } from '../common/interfaces/request-with-user.interface'; // 커스텀 Request 인터페이스 임포트
import { Post as PostEntity } from './post.entity'; // Post 엔티티와 NestJS Post 데코레이터 이름 충돌 방지

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name); //디버깅용
  constructor(private readonly postService: PostService) {}

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
}
