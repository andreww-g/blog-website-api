import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export class UserCreateRequestDto extends createZodDto(createUserSchema) {}
