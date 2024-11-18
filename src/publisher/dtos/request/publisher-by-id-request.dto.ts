import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const publisherByIdSchema = z.object({
  id: z.string().uuid().trim(),
});

export class PublisherByIdRequestDto extends createZodDto(
  publisherByIdSchema,
) {}
