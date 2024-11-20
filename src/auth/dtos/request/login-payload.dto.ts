import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


export const loginSchema = z.object({
  email: z.string().default('authors@blog.com'),
  password: z.string().default('password'),
});

export class LoginPayloadDto extends createZodDto(loginSchema) {}
