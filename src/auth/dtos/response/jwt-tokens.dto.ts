import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const jwtTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class JwtTokensDto extends createZodDto(jwtTokensSchema) {}
