import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Post } from '../post.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'post_id', nullable: false })
  postId: string;

  @ManyToOne(() => Post, (post) => post.images)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'varchar', length: 2048, nullable: false })
  url: string;

  @Column({ type: 'int', nullable: true, default: 0, name: 'order_index' })
  orderIndex: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
