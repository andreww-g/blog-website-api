import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


export const slugSchema = z.object({
  slug: z
    .string()
    .min(1)
    .refine(
      (slug) => /^[\da-z]+[\da-z-]*[\da-z]+$/.test(slug),
      'Slug must be in lower case, can contain letters and numbers, and should be separated.',
    ),
});
