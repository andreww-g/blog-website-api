import {
  Column,
  Entity,
  OneToOne,
} from 'typeorm';

import { AuthorEntity } from '../../authors/entities/author.entity';
import { FileEntity } from '../../file/entities/file.entity';
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

  @OneToOne(() => FileEntity, { nullable: true })
    avatar: FileEntity | null;

  @Column('uuid', { nullable: true })
    authorId: string | null;

  @OneToOne(() => AuthorEntity, (author) => author.user)
    author: AuthorEntity | null;
}
