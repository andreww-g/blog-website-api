import { MigrationInterface, QueryRunner } from 'typeorm';

export class PubliserAvatarNull1737758261232 implements MigrationInterface {
  name = 'PubliserAvatarNull1737758261232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT IF EXISTS "publisher__user_id__key"`);
    await queryRunner.query(`ALTER TABLE "publisher" ADD COLUMN "user_id" uuid NULL`);

    await queryRunner.query(`
      UPDATE "publisher" 
      SET "user_id" = "userId"::uuid 
      WHERE "userId" IS NOT NULL
    `);

    await queryRunner.query(`ALTER TABLE "publisher" DROP COLUMN IF EXISTS "userId"`);

    await queryRunner.query(`ALTER TABLE "publisher" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__user_id__key" UNIQUE ("user_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT IF EXISTS "publisher__user_id__key"`);
    await queryRunner.query(`ALTER TABLE "publisher" ADD COLUMN "userId" uuid NULL`);

    await queryRunner.query(`
      UPDATE "publisher" 
      SET "userId" = "user_id"::uuid 
      WHERE "user_id" IS NOT NULL
    `);

    await queryRunner.query(`ALTER TABLE "publisher" DROP COLUMN IF EXISTS "user_id"`);
    await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__user_id__key" UNIQUE ("userId")`);
  }
}
