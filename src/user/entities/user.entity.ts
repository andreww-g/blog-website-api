import { Column, Entity } from 'typeorm';
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
}
