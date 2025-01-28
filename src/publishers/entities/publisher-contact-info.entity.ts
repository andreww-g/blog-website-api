import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DefaultEntity } from '../../postgres/entities/default.entity';
import { PublisherEntity } from './publisher.entity';

@Entity('publisher_contact_info')
export class PublisherContactInfoEntity extends DefaultEntity {
  @Column({ nullable: true })
  telegram: string | null;

  @Column({ nullable: true })
  facebook: string | null;

  @Column({ nullable: true })
  instagram: string | null;

  @OneToOne(() => PublisherEntity, (pub) => pub.contactInfo)
  @JoinColumn()
  publisher: PublisherEntity;
}
