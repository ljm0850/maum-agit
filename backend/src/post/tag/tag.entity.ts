import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostTag } from '../post-tag/post-tag.entity';
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
