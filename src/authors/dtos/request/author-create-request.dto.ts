import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


const contactInfoSchema = z.object({
  telegram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
});

export const createAuthorSchema = z.object({
  userId: z.string().uuid(),
  description: z.string().nullable(),
  contactInfo: contactInfoSchema.optional(),
});

export class AuthorCreateRequestDto extends createZodDto(createAuthorSchema) {}
