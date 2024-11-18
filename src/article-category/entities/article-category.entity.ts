import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../postgres/entities/default.entity';
import { ArticleEntity } from '../../article/entities/article.entity';
import { ArticleCategoryEnum } from '../../common/enums/article-category.enum';

@Entity()
export class ArticleCategoryEntity extends DefaultEntity {
  @Column({
    type: 'enum',
    enum: ArticleCategoryEnum,
  })
  type: ArticleCategoryEnum;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => ArticleEntity, (article) => article.category)
  articles: ArticleEntity[];
}
