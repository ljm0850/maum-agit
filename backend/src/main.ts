// maum-agit/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser'; // cookie-parser 임포트
import { ValidationPipe } from '@nestjs/common'; // ValidationPipe 임포트
import { ConfigService } from '@nestjs/config'; // ConfigService 임포트 (PORT 환경변수 사용 시)
import * as crypto from 'crypto';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 프리픽스 설정: 모든 API 엔드포인트 앞에 '/api'가 붙게 됩니다.
  // app.setGlobalPrefix('api');

  // 클라이언트로부터 오는 HTTP 요청의 쿠키를 파싱할 수 있음 => 추후 refreshToken용
  // app.use(cookieParser());

  // ValidationPipe 적용
  // DTO(Data Transfer Object)를 사용한 요청 본문 유효성 검사를 자동화합니다.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성은 요청 본문에서 자동 제거
      forbidNonWhitelisted: true, // whitelist 속성 제거 외에, 허용되지 않은 속성이 있으면 오류 발생
      transform: true, // DTO 타입으로 자동 변환 (예: 문자열 "123" -> 숫자 123)
    }),
  );

  // 환경 변수에서 포트 가져오기 (ConfigService를 사용하기 위해 AppModule의 import에도 ConfigModule.forRoot 필요)
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001; // .env의 PORT 사용 또는 기본 3001

  app.enableCors({
    origin: 'http://localhost:3002', // 프론트엔드 개발 서버 포트
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port); // Docker 내부 포트 3001로 고정 또는 환경 변수 사용
}
bootstrap();
