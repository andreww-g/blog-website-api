import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { createUserSchema } from '../../../user/dtos/request/user-create-request.dto';

export const createPublisherSchema = z.object({
  user: createUserSchema,
  contactInfo: z.object({
    telegram: z.string().url().nullish().default(null),
    facebook: z.string().url().nullish().default(null),
    instagram: z.string().url().nullish().default(null),
  }),
});

export class PublisherCreateRequestDto extends createZodDto(createPublisherSchema) {}
