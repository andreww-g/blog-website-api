import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './entities/article.entity';
import { PublisherModule } from '../publishers/publisher.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), PublisherModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
