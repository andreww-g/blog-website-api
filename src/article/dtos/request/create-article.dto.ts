import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.record(z.unknown()).nullable(),
  description: z.string().min(1),
  Id: z.string().uuid(),
  publisherId: z.string().uuid().optional(),
  slug: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export class CreateArticleDto extends createZodDto(createArticleSchema) {}
