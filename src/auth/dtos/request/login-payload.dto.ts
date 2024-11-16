import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const loginSchema = z.object({
  nickName: z.string().min(1),
  password: z.string().min(1),
});

export class LoginPayloadDto extends createZodDto(loginSchema) {}
