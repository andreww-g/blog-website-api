import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { publisherContactInfoSchema } from '../shared/contact-info.dto';
import { publisherAvatarSchema } from '../shared/publisher-avatar.dto';

export const createPublisherSchema = z.object({
  userId: z.string().uuid(),
  avatar: publisherAvatarSchema.optional(),
  contactInfo: publisherContactInfoSchema,
  articleIds: z.array(z.string().uuid()).optional(),
});

export class PublisherCreateRequestDto extends createZodDto(createPublisherSchema) {}
