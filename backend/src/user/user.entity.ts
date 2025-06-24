import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../post/post.entity'; // 나중에 Post 엔티티를 만들면 임포트

@Entity('users') // 데이터베이스 테이블 이름을 'users'로 지정
export class User {
  @PrimaryGeneratedColumn('uuid') // UUID 타입의 기본 키 (자동 생성)
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // nullable: true로 설정 (OAuth에서 제공 안 할 수 있음)
  username: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true }) // unique: true, nullable: true
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false }) // provider_name은 필수
  providerName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true }) // provider_id는 필수, providerName과 조합하여 unique 보장
  // 실제 DB에서는 (providerName, providerId) 조합으로 unique index를 거는 것이 더 정확합니다.
  providerId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImageUrl: string | null;

  @CreateDateColumn() // 생성일시 (자동 생성)
  createdAt: Date;

  @UpdateDateColumn() // 업데이트 일시 (자동 업데이트)
  updatedAt: Date;

  // 관계 정의: 한 User는 여러 Post를 가질 수 있습니다.
  @OneToMany(() => Post, (post) => post.user) // (다른 엔티티) => 다른 엔티티의 관계 컬럼
  posts: Post[]; // 해당 User가 작성한 Post 배열
}
