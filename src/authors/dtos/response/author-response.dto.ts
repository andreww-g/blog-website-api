import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { userResponseSchema } from '../../../user/dtos/response/user-response.dto';


export const authorResponseSchema = z.object({
  id: z.number(),
  contactInfo: z.object({
    telegram: z.string().nullable(),
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
  }),
  description: z.string().nullable(),
  userId: z.string().uuid(),
  user: userResponseSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class AuthorResponseDto extends createZodDto(authorResponseSchema) {}
