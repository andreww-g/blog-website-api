import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthorEntity } from './author.entity';
import { DefaultEntity } from '../../postgres/entities/default.entity';

@Entity('contact_info')
export class ContactInfoEntity extends DefaultEntity {
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
