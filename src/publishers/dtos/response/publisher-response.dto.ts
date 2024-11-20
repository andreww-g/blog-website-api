import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { articleResponseSchema } from '../../../article/dtos/response/article-response.dto';
import { authorResponseSchema } from '../../../authors/dtos/response/author-response.dto';


export const publisherResponseSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  author: authorResponseSchema,
  articles: z.array(articleResponseSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class PublisherResponseDto extends createZodDto(publisherResponseSchema) {}
