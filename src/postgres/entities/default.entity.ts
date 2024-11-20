import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


export class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
    deletedAt: Date | null;
}
