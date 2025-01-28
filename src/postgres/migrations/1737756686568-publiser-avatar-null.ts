import { MigrationInterface, QueryRunner } from "typeorm";

export class PubliserAvatarNull1737756686568 implements MigrationInterface {
    name = 'PubliserAvatarNull1737756686568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__avatar_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "publisher" ALTER COLUMN "avatar_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__avatar_id__f_key" FOREIGN KEY ("avatar_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__avatar_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "publisher" ALTER COLUMN "avatar_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__avatar_id__f_key" FOREIGN KEY ("avatar_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
