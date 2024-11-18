import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z
    .object({
      url: z.string().url(),
      name: z.string(),
      mimeType: z.string().nullish(),
      size: z.number().nullish(),
    })
    .nullable(),
});

export class UserCreateRequestDto extends createZodDto(createUserSchema) {}
