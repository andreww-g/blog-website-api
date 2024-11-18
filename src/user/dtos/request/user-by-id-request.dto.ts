import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const userByIdRequestSchema = z.object({
  id: z.string().uuid().trim().min(1),
});

export class UserByIdRequestDto extends createZodDto(userByIdRequestSchema) {}
