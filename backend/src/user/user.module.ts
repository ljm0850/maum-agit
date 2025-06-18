import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeOrmModule 임포트
import { User } from './user.entity'; // User 엔티티 임포트

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User 엔티티를 이 모듈에 등록
  controllers: [],
  providers: [],
  exports: [TypeOrmModule], // User 엔티티의 Repository를 다른 모듈에서 사용하려면 export해야 합니다.
})
export class UserModule {}
