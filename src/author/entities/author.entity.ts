import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DefaultEntity } from '../../postgres/entities/default.entity';
import { PublisherEntity } from '../../publisher/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';

import { AuthorContactInfoEntity } from './author-contact-info.entity';

@Entity('authors')
export class AuthorEntity extends DefaultEntity {
  @OneToOne(
    () => AuthorContactInfoEntity,
    (contactInfo) => contactInfo.author,
    {
      cascade: true,
    },
  )
    contactInfo: AuthorContactInfoEntity;

  @Column('varchar', { nullable: true })
    description: string | null;

  @Column('varchar')
    userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
    user: UserEntity;

  @Column('uuid', { nullable: true })
    publisherId: string | null;

  @OneToOne(() => PublisherEntity, (publisher) => publisher.author)
    publisher: PublisherEntity;
}
