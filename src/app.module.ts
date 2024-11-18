import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { ArticleCategoryModule } from './article-category/article-category.module';
import { AuthModule } from './auth/auth.module';
import { AuthorModule } from './author/author.module';
import { FileModule } from './file/file.module';
import { DatabasePostgresModule } from './postgres/database-postgres.module';
import { PublisherModule } from './publisher/publisher.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    AuthModule,
    PublisherModule,
    ReviewsModule,
    FileModule,
    ArticleModule,
    ArticleCategoryModule,
    AuthorModule,
    DatabasePostgresModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
