import { PassportStrategy } from '@nestjs/passport'; // NestJS와 Passport 연동
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20'; // Google OAuth 2.0 전략 및 타입
import { Injectable, InternalServerErrorException } from '@nestjs/common'; // NestJS 의존성 주입 및 예외 처리
import { ConfigService } from '@nestjs/config'; // 환경 변수 접근
import { AuthService } from './auth.service'; // 사용자 비즈니스 로직 처리 서비스
import { Request } from 'express'; // req 객체 타입 힌트 (npm install @types/express)
import { User } from '../user/user.entity';
// GoogleStrategy 클래스 정의
@Injectable() // NestJS가 이 클래스를 의존성 주입 대상으로 인식하게 함
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // - `'google'`: 이 전략의 이름을 'google'로 지정.

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new InternalServerErrorException(
        'Google OAuth environment variables (CLIENT_ID, CLIENT_SECRET, CALLBACK_URL) are not set correctly.',
      );
    }

    super({
      clientID: clientID, // Google Cloud Console에서 발급받은 클라이언트 ID
      clientSecret: clientSecret, // Google Cloud Console에서 발급받은 클라이언트 Secret
      callbackURL: callbackURL, // Google 인증 후 리다이렉트될 백엔드 콜백 URL
      scope: ['email', 'profile'], // Google에서 사용자의 이메일과 프로필 정보 요청
      passReqToCallback: true, // `validate` 메서드에 `req` 객체를 첫 번째 인자로 전달하도록 설정 (타입 요구사항)
    });
  }

  // validate 메서드: Google 인증 후 사용자 정보 처리
  async validate(
    req: Request, // `passReqToCallback: true` 때문에 추가된 Express Request 객체
    accessToken: string, // Google에서 발급한 액세스 토큰
    refreshToken: string, // Google에서 발급한 리프레시 토큰 (만료된 액세스 토큰 갱신용)
    profile: Profile, // Google에서 제공하는 사용자의 상세 프로필 정보 (JSON 형식)
    done: VerifyCallback, // Passport.js에 인증 결과(성공/실패, 사용자 객체)를 전달하는 콜백 함수
  ): Promise<any> {
    // Google `profile` 객체에서 필요한 정보 추출
    const { name, emails, photos, id } = profile;

    // 우리 애플리케이션의 User 모델에 맞게 프로필 정보 정리
    const userProfile = {
      providerName: 'google', // 로그인 제공자 (하드코딩)
      providerId: id, // Google 사용자 고유 ID (DB에서 사용자 식별용)
      email: emails && emails.length > 0 ? emails[0].value : undefined, // 이메일 (배열에서 첫 번째 값)
      username:
        name?.givenName + ' ' + name?.familyName ||
        (emails && emails.length > 0
          ? emails[0].value.split('@')[0]
          : '사용자'), // 이름 (없으면 이메일 앞부분)
      profileImageUrl:
        photos && photos.length > 0 ? photos[0].value : undefined, // 프로필 사진 URL (배열에서 첫 번째 값)
    };

    try {
      // --- 수정된 부분: user의 타입을 User | null로 선언하고 null 체크를 추가합니다. ---
      const user: User | null =
        await this.authService.validateOrCreateUser(userProfile);

      if (!user) {
        // 만약 사용자 생성/업데이트에 실패하여 null이 반환되었다면
        console.error('Failed to validate or create user in AuthService.');
        done(
          new InternalServerErrorException('Failed to process user data.'),
          undefined,
        );
        return; // done() 호출 후 함수 종료
      }
      done(null, user);
    } catch (error) {
      // 오류 발생 시 Passport.js에 에러를 전달하여 인증 실패를 알립니다.
      console.error('Error validating Google user:', error);
      done(
        new InternalServerErrorException('Error validating Google user'),
        undefined,
      );
    }
  }
}
