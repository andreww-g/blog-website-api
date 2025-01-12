import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1736686213126 implements MigrationInterface {
    name = 'Init1736686213126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "users__email__key" UNIQUE ("email"), CONSTRAINT "users__id__p_key" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."article_category_type_enum" NOT NULL, "name" character varying NOT NULL, CONSTRAINT "article_category__id__p_key" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "url" character varying NOT NULL, "name" character varying NOT NULL, "mime_type" character varying, "size" double precision, CONSTRAINT "file__id__p_key" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "content" json, "published_at" TIMESTAMP, "publisher_id" uuid, "category_id" uuid, CONSTRAINT "article__slug__key" UNIQUE ("slug"), CONSTRAINT "article__id__p_key" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "article__slug__idx" ON "article" ("slug") `);
        await queryRunner.query(`CREATE TABLE "publisher_contact_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "telegram" character varying, "facebook" character varying, "instagram" character varying, "publisher_id" uuid, CONSTRAINT "REL_7d33db1845c5dc9a0c321d21c2" UNIQUE ("publisher_id"), CONSTRAINT "publisher_contact_info__id__p_key" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publisher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "REL_a6ed610742518dc1f7f7715223" UNIQUE ("user_id"), CONSTRAINT "publisher__id__p_key" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "article__publisher_id__f_key" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "article__category_id__f_key" FOREIGN KEY ("category_id") REFERENCES "article_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publisher_contact_info" ADD CONSTRAINT "publisher_contact_info__publisher_id__f_key" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publisher" ADD CONSTRAINT "publisher__user_id__f_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "publisher" DROP CONSTRAINT "publisher__user_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "publisher_contact_info" DROP CONSTRAINT "publisher_contact_info__publisher_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "article__category_id__f_key"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "article__publisher_id__f_key"`);
        await queryRunner.query(`DROP TABLE "publisher"`);
        await queryRunner.query(`DROP TABLE "publisher_contact_info"`);
        await queryRunner.query(`DROP INDEX "public"."article__slug__idx"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "article_category"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
