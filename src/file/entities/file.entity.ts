import { Column, Entity } from 'typeorm';

import { DefaultEntity } from '../../postgres/entities/default.entity';

@Entity()
export class FileEntity extends DefaultEntity {
  @Column('varchar', { nullable: false })
    url: string;

  @Column('varchar', { nullable: false })
    name: string;

  @Column('varchar', { nullable: true })
    mimeType: string | null;

  @Column('float', { nullable: true })
    size: number | null;
}
