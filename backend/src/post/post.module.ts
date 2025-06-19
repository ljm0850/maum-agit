import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Image } from './image/image.entity';
import { Tag } from './tag/tag.entity';
import { PostTag } from './post-tag/post-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image, Tag, PostTag])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class PostModule {}
