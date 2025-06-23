// maum-agit/backend/src/auth/auth.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Passport 가드를 사용하기 위함
import { Request, Response } from 'express'; // Express Request, Response 타입 사용
import { AuthService } from './auth.service'; // JWT 생성을 위해 AuthService 주입
import { User } from '../user/user.entity'; // @Req() user: User 타입을 위해 임포트
import { ConfigService } from '@nestjs/config'; // 환경 변수 접근을 위함

@Controller('auth') // 이 컨트롤러의 기본 경로를 '/auth'로 설정
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService, // 환경 변수를 가져오기 위해 ConfigService 주입
  ) {}

  /**
   * @GET /auth/google
   * Google OAuth 로그인 프로세스를 시작하는 엔드포인트.
   * 사용자를 Google 로그인 페이지로 리다이렉트합니다.
   */
  @Get('google')
  @UseGuards(AuthGuard('google')) // 'google' 전략을 사용하여 Google OAuth 인증 흐름 시작
  async googleAuth(@Req() req: Request) {
    // 이 핸들러는 실제로 실행되지 않습니다.
    // AuthGuard('google')이 사용자를 Google 인증 페이지로 리다이렉트합니다.
    // 따라서 여기에 비즈니스 로직을 추가할 필요는 없습니다.
  }

  /**
   * @GET /auth/google/callback
   * Google OAuth 인증 후 Google로부터 콜백을 받는 엔드포인트.
   * 인증이 성공하면 JWT를 발급하여 프론트엔드로 리다이렉트합니다.
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google')) // Google 콜백을 처리하고 validate() 메서드를 호출
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // req.user는 google.strategy.ts의 validate() 메서드에서 done(null, user)를 통해 넘어온 User 객체입니다.
    const user = req.user as User; // req.user의 타입을 User로 단언

    if (!user) {
      // 사용자가 없으면 오류 처리
      const frontendErrorUrl =
        this.configService.get<string>('FRONTEND_ERROR_URL');
      if (frontendErrorUrl) {
        return res.redirect(`${frontendErrorUrl}?error=auth_failed`);
      }
      throw new InternalServerErrorException(
        'Authentication failed or user data not found.',
      );
    }

    // AuthService를 사용하여 JWT 생성
    const { accessToken } = this.authService.generateJwt(user);

    // 환경 변수에서 프론트엔드 콜백 URL을 가져옵니다.
    const frontendCallbackUrl = this.configService.get<string>(
      'FRONTEND_CALLBACK_URL',
    );

    if (!frontendCallbackUrl) {
      throw new InternalServerErrorException(
        'FRONTEND_CALLBACK_URL is not set in environment variables.',
      );
    }

    // JWT를 쿼리 파라미터로 포함하여 프론트엔드로 리다이렉트합니다.
    // 프론트엔드는 이 URL에서 accessToken을 추출하여 사용합니다.
    return res.redirect(`${frontendCallbackUrl}?accessToken=${accessToken}`);
  }
}
