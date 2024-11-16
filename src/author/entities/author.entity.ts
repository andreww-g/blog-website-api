import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { DefaultEntity } from '../../postgres/entities/default.entity';

@Entity('authors')
export class AuthorEntity extends DefaultEntity {
  @OneToOne(() => ContactInfoEntity, (contactInfo) => contactInfo.author, {
    cascade: true,
  })
  contactInfo: ContactInfoEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar')
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
