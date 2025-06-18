import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('posts') // 테이블 이름 posts
export class Post {
  @PrimaryGeneratedColumn('uuid') // UUID 타입의 기본 키
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false }) // 제목 컬럼 추가
  title: string;

  // 외래키
  @Column({ type: 'uuid', name: 'user_id', nullable: false }) // name 옵션으로 실제 DB 컬럼명 지정
  userId: string;

  @ManyToOne(() => User, (user) => user.posts) // 1:N
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 글 내용
  @Column({ type: 'text', nullable: false }) // 원본 글
  originalContent: string;

  @Column({ type: 'text', nullable: true }) // 순화된 글
  purifiedContent: string;

  // 날자
  @CreateDateColumn({ name: 'created_at' }) // 작성일
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // 업데이트 일
  updatedAt: Date;
}
