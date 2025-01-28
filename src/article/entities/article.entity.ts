import { Column, Entity, Index, ManyToOne, ObjectLiteral, OneToOne } from 'typeorm';

import { ArticleCategoryEntity } from './article-category.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { DefaultEntity } from '../../postgres/entities/default.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';

@Entity()
export class ArticleEntity extends DefaultEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', unique: true })
  @Index()
  slug: string;

  @Column({ type: 'varchar' })
  description: string;

  @OneToOne(() => FileEntity, { nullable: true })
  image: FileEntity | null;

  @Column({ type: 'json', nullable: true })
  content: ObjectLiteral | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  publishedAt: Date | null;

  @Column('uuid', { nullable: true })
  publisherId: string | null;

  @ManyToOne(() => PublisherEntity, (publisher) => publisher.articles)
  publisher: PublisherEntity | null;

  @Column('uuid', { nullable: true })
  categoryId: string | null;

  @ManyToOne(() => ArticleCategoryEntity, (category) => category.articles)
  category: ArticleCategoryEntity | null;
}
