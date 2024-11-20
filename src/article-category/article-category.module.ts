import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleCategoryService } from './article-category.service';
import { ArticleCategoryEntity } from './entities/article-category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleCategoryEntity,
    ]),
  ],
  providers: [ArticleCategoryService],
})
export class ArticleCategoryModule {}
