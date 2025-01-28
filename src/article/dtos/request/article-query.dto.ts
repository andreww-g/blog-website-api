import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { valueToBoolean } from '../../../common/utils/value-to-boolean';

export const articleQueryRequestSchema = z.object({
  onlyPublished: z.preprocess(valueToBoolean, z.boolean().nullish()),
});

export class ArticleQueryDto extends createZodDto(articleQueryRequestSchema) {}
