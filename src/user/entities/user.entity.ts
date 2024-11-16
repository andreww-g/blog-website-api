import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { AuthorEntity } from '../../author/entities/author.entity';
import { DefaultEntity } from '../../postgres/entities/default.entity';

@Entity('users')
export class UserEntity extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string | null;

  @OneToOne(() => AuthorEntity, (author) => author.user)
  author: AuthorEntity;
}
