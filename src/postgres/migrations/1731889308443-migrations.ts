import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1731889308443 implements MigrationInterface {
    name = 'Migrations1731889308443';

    public async up (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."article_category_type_enum" AS ENUM(\'TECHNOLOGY\', \'BUSINESS\', \'LIFESTYLE\')');
        await queryRunner.query('CREATE TABLE "article_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."article_category_type_enum" NOT NULL, "name" character varying NOT NULL, CONSTRAINT "article_category__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "url" character varying NOT NULL, "name" character varying NOT NULL, "mime_type" character varying, "size" double precision, CONSTRAINT "file__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "content" json, "published_at" TIMESTAMP, "publisher_id" uuid, "category_id" uuid, CONSTRAINT "article__slug__key" UNIQUE ("slug"), CONSTRAINT "article__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "article__slug__idx" ON "article" ("slug") ');
        await queryRunner.query('CREATE TABLE "publisher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "author_id" uuid NOT NULL, "authorId" uuid, CONSTRAINT "REL_403b37515a523165d3bbf5ece3" UNIQUE ("authorId"), CONSTRAINT "publisher__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "contact_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "telegram" character varying, "facebook" character varying, "instagram" character varying, "author_id" uuid, CONSTRAINT "REL_67e56e7b4cded4d5cf939b5648" UNIQUE ("author_id"), CONSTRAINT "contact_info__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "authors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" character varying, "user_id" uuid NOT NULL, "publisher_id" uuid, CONSTRAINT "REL_ccb4b08154f01e48f1524b1a43" UNIQUE ("user_id"), CONSTRAINT "authors__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "author_id" uuid NOT NULL, CONSTRAINT "users__email__key" UNIQUE ("email"), CONSTRAINT "users__id__p_key" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "article" ADD CONSTRAINT "article__publisher_id__f_key" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "article" ADD CONSTRAINT "article__category_id__f_key" FOREIGN KEY ("category_id") REFERENCES "article_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "publisher" ADD CONSTRAINT "publisher__author_id__f_key" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info__author_id__f_key" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "authors" ADD CONSTRAINT "authors__user_id__f_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "authors" DROP CONSTRAINT "authors__user_id__f_key"');
        await queryRunner.query('ALTER TABLE "contact_info" DROP CONSTRAINT "contact_info__author_id__f_key"');
        await queryRunner.query('ALTER TABLE "publisher" DROP CONSTRAINT "publisher__author_id__f_key"');
        await queryRunner.query('ALTER TABLE "article" DROP CONSTRAINT "article__category_id__f_key"');
        await queryRunner.query('ALTER TABLE "article" DROP CONSTRAINT "article__publisher_id__f_key"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TABLE "authors"');
        await queryRunner.query('DROP TABLE "contact_info"');
        await queryRunner.query('DROP TABLE "publisher"');
        await queryRunner.query('DROP INDEX "public"."article__slug__idx"');
        await queryRunner.query('DROP TABLE "article"');
        await queryRunner.query('DROP TABLE "file"');
        await queryRunner.query('DROP TABLE "article_category"');
        await queryRunner.query('DROP TYPE "public"."article_category_type_enum"');
    }

}
