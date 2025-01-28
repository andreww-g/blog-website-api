import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { ArticleEntity } from '../../article/entities/article.entity';
import { DefaultEntity } from '../../postgres/entities/default.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { PublisherContactInfoEntity } from './publisher-contact-info.entity';

@Entity()
export class PublisherEntity extends DefaultEntity {
  @Column('uuid', { nullable: true })
  avatarId: string | null;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn()
  avatar: FileEntity | null;

  @OneToOne(() => PublisherContactInfoEntity, (contactInfo) => contactInfo.publisher, { cascade: true })
  contactInfo: PublisherContactInfoEntity;

  @Column('uuid')
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => ArticleEntity, (article) => article.publisher)
  articles: ArticleEntity[];
}
