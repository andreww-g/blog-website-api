import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.object({
    url: z.string().url(),
    name: z.string(),
    mimeType: z.string().nullable(),
    size: z.number().nullable(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class UserResponseDto extends createZodDto(userResponseSchema) {}
