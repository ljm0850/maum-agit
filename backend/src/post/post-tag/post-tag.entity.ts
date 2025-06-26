import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from '../post.entity';
import { Tag } from '../tag/tag.entity';

@Entity('postTags')
export class PostTag {
  @PrimaryColumn({ type: 'uuid', name: 'post_id' })
  postId: string;

  @PrimaryColumn({ type: 'uuid', name: 'tag_id' })
  tagId: string;

  @ManyToOne(() => Post, (post) => post.postTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
