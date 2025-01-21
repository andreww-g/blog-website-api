import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { slugSchema } from '../../../common/utils/zod/zod-slug.schema';
import { articleCategorySchema } from './article-category-request.dto';

const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.record(z.unknown()).nullable(),
  description: z.string().min(1),
  publisherId: z.string().uuid().optional(),
  slug: slugSchema.shape.slug,
  image: z.object({
    url: z.string().url(),
    name: z.string(),
    mimeType: z.string().nullable(),
    size: z.number().nullable(),
  }).nullable(),
  category: articleCategorySchema.nullable()
});

export class CreateArticleDto extends createZodDto(createArticleSchema) {}
