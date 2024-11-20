import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatar: z
    .object({
      url: z.string().url().optional(),
      name: z.string().optional(),
      mimeType: z.string().nullish(),
      size: z.number().nullish(),
    })
    .optional(),
});

export class UserUpdateRequestDto extends createZodDto(updateUserSchema) {}
