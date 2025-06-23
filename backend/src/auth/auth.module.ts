// maum-agit/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'; // Passport 기본 모듈
import { JwtModule } from '@nestjs/jwt'; // JWT 토큰 모듈
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM 엔티티 레포지토리 주입을 위함
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수 접근을 위함

import { AuthService } from './auth.service'; // 방금 작성한 인증 로직 서비스
import { AuthController } from './auth.controller'; // 인증 관련 API 엔드포인트 컨트롤러

import { User } from '../user/user.entity'; // User 엔티티 (AuthService에서 사용)

// 작성 완료한 Passport 전략들 임포트
import { GoogleStrategy } from './google.strategy'; // Google OAuth 전략
import { JwtStrategy } from './jwt.strategy'; // JWT 인증 전략

@Module({
  imports: [
    // 1. ConfigModule: NestJS 전역 환경 설정 모듈. `.env` 파일의 변수들을 읽어올 수 있게 합니다.
    ConfigModule,

    // 2. PassportModule: NestJS에서 Passport.js를 사용하기 위한 기본 모듈입니다.
    //    'defaultStrategy'를 'jwt'로 설정하면, @UseGuards()에 아무런 인자를 주지 않을 때 기본적으로 JWT 인증을 시도합니다.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 3. JwtModule: JWT 토큰을 생성하고 검증하는 데 사용됩니다.
    //    `registerAsync`를 사용하여 ConfigService로부터 `.env`의 JWT_SECRET을 비동기적으로 가져옵니다.
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigService를 사용하기 위해 ConfigModule 임포트
      inject: [ConfigService], // ConfigService를 주입받음
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // .env의 JWT_SECRET 사용
        signOptions: { expiresIn: '1h' }, // 토큰 유효 기간 (예: 1시간)
      }),
    }),

    // 4. TypeOrmModule.forFeature: User 엔티티의 TypeORM Repository를 이 모듈 내에서 주입받아 사용할 수 있도록 합니다.
    //    AuthService에서 사용자 정보를 DB에 저장/조회할 때 필요합니다.
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController], // 이 모듈이 관리할 컨트롤러 등록
  providers: [
    AuthService, // 인증 비즈니스 로직을 제공하는 서비스
    GoogleStrategy, // Google OAuth 인증 전략
    JwtStrategy, // JWT 토큰 인증 전략
  ], // 이 모듈이 제공할 서비스 및 전략 등록
  exports: [
    AuthService, // AuthService를 다른 모듈에서 주입받아 사용할 수 있도록 export
    JwtModule, // JwtModule을 다른 모듈에서 사용 (예: @UseGuards(AuthGuard('jwt')) 없이도 JwtService 사용)
    PassportModule, // PassportModule을 다른 모듈에서 사용 (예: 다른 모듈에서 AuthGuard 사용)
  ], // 이 모듈의 서비스/모듈 중 다른 모듈에서 사용될 수 있는 것들을 export
})
export class AuthModule {}
