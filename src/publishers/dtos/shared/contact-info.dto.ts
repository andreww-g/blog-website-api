import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const publisherContactInfoSchema = z.object({
  telegram: z.string().url().nullish(),
  facebook: z.string().url().nullish(),
  instagram: z.string().url().nullish(),
});
