import { MigrationInterface, QueryRunner } from "typeorm";

export class PubliserRelations1737141340605 implements MigrationInterface {
    name = 'PubliserRelations1737141340605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "publisher" ADD "avatar_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__avatar_id__key" UNIQUE ("avatar_id")`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__user_id__key" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__user_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "REL_a6ed610742518dc1f7f7715223"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__avatar_id__f_key" FOREIGN KEY ("avatar_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__user_id__f_key" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__user_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__avatar_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "REL_a6ed610742518dc1f7f7715223" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__user_id__f_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__user_id__key"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__avatar_id__key"`);
        await queryRunner.query(`ALTER TABLE "publisher" DROP COLUMN "avatar_id"`);
    }

}
