import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { articleResponseSchema } from '../../../article/dtos/response/article-response.dto';
import { userResponseSchema } from '../../../user/dtos/response/user-response.dto';
import { publisherContactInfoSchema } from '../shared/contact-info.dto';

export const publisherResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  user: userResponseSchema,
  avatar: z.object({
    url: z.string().url(),
    name: z.string(),
    mimeType: z.string().nullable(),
    size: z.number().nullable(),
  }),
  contactInfo: publisherContactInfoSchema,
  articles: z.array(z.lazy(() => articleResponseSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class PublisherResponseDto extends createZodDto(publisherResponseSchema) {}
