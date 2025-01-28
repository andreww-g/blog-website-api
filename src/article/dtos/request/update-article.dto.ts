import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.record((z.unknown())).nullable(),
  description: z.string().min(1).optional(),
  publisherId: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
});

export class UpdateArticleDto extends createZodDto(updateArticleSchema) {}
