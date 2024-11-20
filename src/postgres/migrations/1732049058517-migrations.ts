import { MigrationInterface, QueryRunner } from 'typeorm';


export class Migrations1732049058517 implements MigrationInterface {
  name = 'Migrations1732049058517';

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "author_id" DROP NOT NULL');
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "author_id" SET NOT NULL');
  }

}
