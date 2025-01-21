import { z } from 'nestjs-zod/z';
import { publisherContactInfoSchema } from '../shared/contact-info.dto';
import { updateUserSchema } from '../../../user/dtos/request/user-update-request.dto';
import { publisherAvatarSchema } from '../shared/publisher-avatar.dto';
import { createZodDto } from 'nestjs-zod';

export const publisherUpdateSchema = z.object({
  contactInfo: publisherContactInfoSchema.optional(),
  avatar: publisherAvatarSchema.optional(),
  user: updateUserSchema.optional(),
});

export class PublisherUpdateRequestDto extends createZodDto(publisherUpdateSchema) {}
