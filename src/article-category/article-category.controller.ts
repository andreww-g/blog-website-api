import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ArticleCategoryService } from './article-category.service';


@ApiTags('Article Categories')
@Controller('article-categories')
export class ArticleCategoryController {
  constructor (private readonly articleCategoryService: ArticleCategoryService) {}
}
