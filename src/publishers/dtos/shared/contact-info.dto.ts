import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const publisherContactInfoSchema = z.object({
  id: z.string().uuid(),
  telegram: z.string().nullish(),
  facebook: z.string().nullish(),
  instagram: z.string().nullish(),
});

export class ContactInfoDto extends createZodDto(publisherContactInfoSchema) {}
