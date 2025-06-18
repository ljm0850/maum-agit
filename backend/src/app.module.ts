// 기본 import
import { Module } from '@nestjs/common'; // NestJS의 모듈 데코레이터와 기능들을 제공하는 핵심 패키지
import { AppController } from './app.controller'; //
import { AppService } from './app.service';
// 추가 외부 라이브러리 import
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORMModule 사용
import { ConfigModule } from '@nestjs/config'; // 환경 변수 관리를 위한 ConfigModule
// 작성한 엔티티 import
// import { User } from './user/user.entity';
// import { Post } from './post/post.entity';
// import { Image } from './image/image.entity';
// import { Tag } from './tag/tag.entity';
// import { PostTag } from './post-tag/post-tag.entity';

// @Module() 데코레이터: 이 클래스가 NestJS 모듈임을 선언
// 모듈은 애플리케이션의 특정 기능 영역을 나타냄(관련된 컨트롤러, 프로바이더, 다른 모듈을 묶음)
@Module({
  // imports 배열: 이 모듈에서 사용할 다른 NestJS 모듈들(프로바이더, 컨트롤러 ...)을 임포트
  imports: [
    ConfigModule.forRoot({
      // .env 파일 로드를 위한 설정
      isGlobal: true, // 전역적으로 환경 변수를 사용할 수 있게 함, 다른 모듈에서 ConfigService를 별도로 임포트/익스포트하지 않아도 사용 가능
      envFilePath: '.env', // .env 파일 경로 지정
    }),
    // TypeOrmModule 설정: 데이터베이스 연결 설정을 정의
    TypeOrmModule.forRoot({
      type: 'mysql', // 데이터베이스 타입
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [], // 데이터베이스 엔티티들을 배열로 추가
      synchronize: true, // 개발 환경에서만 true로 설정 (데이터베이스 스키마를 자동으로 동기화. 운영에서는 false)
      logging: true, // SQL 쿼리 로깅 활성화 (개발 시 유용)
    }),
  ],
  // controllers 배열: 이 모듈에 속한 HTTP 요청 처리 컨트롤러들을 등록
  controllers: [AppController],
  // providers 배열: 이 모듈에 속한 서비스, 리포지토리 등 프로바이더들을 등록
  providers: [AppService],
})
export class AppModule {}
