import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


const publisherByIdSchema = z.object({
  id: z.string().uuid().trim(),
});

export class PublisherByIdRequestDto extends createZodDto(
  publisherByIdSchema,
) {}
