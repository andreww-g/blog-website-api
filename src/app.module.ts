import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PublisherModule } from './publisher/publisher.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BlogModule } from './blog/blog.module';
import { FileModule } from './file/file.module';
import { ArticleModule } from './article/article.module';
import { ArticleCategoryModule } from './article-category/article-category.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    PublisherModule,
    ReviewsModule,
    BlogModule,
    FileModule,
    ArticleModule,
    ArticleCategoryModule,
    AuthorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
