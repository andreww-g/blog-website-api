import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


export const articleByIdRequestSchema = z.object({
  id: z.string().uuid().trim().min(1),
});

export class ArticleByIdRequestDto extends createZodDto(
  articleByIdRequestSchema,
) {}
