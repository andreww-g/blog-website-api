import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { articleCategorySchema } from '../../../article-category/dtos/shared/article-category-request.dto';
import { publisherResponseSchema } from '../../../publishers/dtos/response/publisher-response.dto';

export const articleResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.record(z.unknown()).nullable(),
  description: z.string(),
  Id: z.string().uuid(),
  publisherId: z.string().uuid().nullable(),
  publisher: z.lazy(() => publisherResponseSchema),
  slug: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  category: articleCategorySchema,
  isPublished: z.boolean(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class ArticleResponseDto extends createZodDto(articleResponseSchema) {}
