import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createPublisherSchema = z.object({
  authorId: z.string().uuid(),
  articleIds: z.array(z.string().uuid()).optional(),
});

export class PublisherCreateRequestDto extends createZodDto(createPublisherSchema) {} 