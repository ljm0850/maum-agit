import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class PostModule {}
