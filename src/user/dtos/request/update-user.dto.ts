import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  avatar: z.string().optional(),
}).partial();

export class UpdateUserDto extends createZodDto(updateUserSchema) {} 