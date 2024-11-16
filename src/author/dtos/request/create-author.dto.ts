import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const contactInfoSchema = z.object({
  telegram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
});

export const createAuthorSchema = z.object({
  userId: z.string().uuid(),
  contactInfo: contactInfoSchema.optional(),
});

export class CreateAuthorDto extends createZodDto(createAuthorSchema) {} 