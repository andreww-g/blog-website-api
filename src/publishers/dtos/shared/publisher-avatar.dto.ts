import { z } from 'nestjs-zod/z';

export const publisherAvatarSchema = z
  .object({
    url: z.string().url(),
    name: z.string(),
    mimeType: z.string().nullish(),
    size: z.number().nullish(),
  })
  .nullable();
