import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { ArticleCategoryEnum } from '../../../common/enums/article-category.enum';


export const articleCategorySchema = z.object({
  type: z.nativeEnum(ArticleCategoryEnum),
  name: z.string(),
});

export class ArticleCategoryDto extends createZodDto(articleCategorySchema) {}
