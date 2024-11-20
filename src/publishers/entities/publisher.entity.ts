import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';

import { ArticleEntity } from '../../article/entities/article.entity';
import { AuthorEntity } from '../../authors/entities/author.entity';
import { DefaultEntity } from '../../postgres/entities/default.entity';


@Entity()
export class PublisherEntity extends DefaultEntity {
  @Column('uuid', { nullable: false })
    authorId: string;

  @OneToOne(() => AuthorEntity)
  @JoinColumn({ name: 'authorId' })
    author: AuthorEntity;

  @OneToMany(() => ArticleEntity, (article) => article.publisher)
    articles: ArticleEntity[];
}
