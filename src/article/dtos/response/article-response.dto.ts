import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const articleResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.record((z.unknown())).nullable(),
  description: z.string(),
  authorId: z.string().uuid(),
  publisherId: z.string().uuid().nullable(),
  slug: z.string(),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class ArticleResponseDto extends createZodDto(articleResponseSchema) {}
