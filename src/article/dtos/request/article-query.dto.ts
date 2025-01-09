import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


export const articleQueryRequestSchema = z.object({
  onlyPublished: z.boolean().nullish(),
});

export class ArticleQueryDto extends createZodDto(
  articleQueryRequestSchema,
) {}
