import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createPublisherSchema = z.object({
  userId: z.string().uuid(),
  articleIds: z.array(z.string().uuid()).optional(),
});

export class PublisherCreateRequestDto extends createZodDto(createPublisherSchema) {}
