import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DefaultEntity } from '../../postgres/entities/default.entity';

import { AuthorEntity } from './author.entity';

@Entity('contact_info')
export class AuthorContactInfoEntity extends DefaultEntity {
  @Column({ nullable: true })
  telegram: string | null;

  @Column({ nullable: true })
  facebook: string | null;

  @Column({ nullable: true })
  instagram: string | null;

  @OneToOne(() => AuthorEntity, (author) => author.contactInfo)
  @JoinColumn()
  author: AuthorEntity;
}
