import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { authorResponseSchema } from '../../../author/dtos/response/author-response.dto';
import { articleResponseSchema } from '../../../article/dtos/response/article-response.dto';

export const publisherResponseSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  author: authorResponseSchema,
  articles: z.array(articleResponseSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class PublisherResponseDto extends createZodDto(publisherResponseSchema) {}
