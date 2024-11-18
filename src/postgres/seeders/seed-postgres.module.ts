import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../../article/entities/article.entity';
import { ArticleCategoryEntity } from '../../article-category/entities/article-category.entity';
import { AuthorContactInfoEntity } from '../../author/entities/author-contact-info.entity';
import { AuthorEntity } from '../../author/entities/author.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { PublisherEntity } from '../../publisher/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { DatabasePostgresModule } from '../database-postgres.module';

import { SeedPostgresService } from './seed-postgres.service';


@Module({
  imports: [
    DatabasePostgresModule,
    TypeOrmModule.forFeature([
      UserEntity,
      ArticleCategoryEntity,
      ArticleEntity,
      PublisherEntity,
      AuthorEntity,
      FileEntity,
      AuthorContactInfoEntity,
      ]),
  ],
  providers: [
    SeedPostgresService,
  ],
})
export class SeedPostgresModule {}
