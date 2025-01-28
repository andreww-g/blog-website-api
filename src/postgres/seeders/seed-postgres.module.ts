import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleEntity } from '../../article/entities/article.entity';
import { ArticleCategoryEntity } from '../../article/entities/article-category.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { DatabasePostgresModule } from '../database-postgres.module';
import { PublisherContactInfoEntity } from '../../publishers/entities/publisher-contact-info.entity';
import { SeedPostgresService } from './seed-postgres.service';
import { SeedCommand } from './seed.command';

@Module({
  imports: [
    DatabasePostgresModule,
    TypeOrmModule.forFeature([
      UserEntity,
      ArticleCategoryEntity,
      ArticleEntity,
      PublisherEntity,
      FileEntity,
      PublisherContactInfoEntity,
    ]),
  ],
  providers: [SeedPostgresService, SeedCommand],
  exports: [SeedPostgresService],
})
export class SeedPostgresModule {}
