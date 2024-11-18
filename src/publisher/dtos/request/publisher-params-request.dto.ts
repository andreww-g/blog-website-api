import { z } from 'nestjs-zod/z';
import { paginationSchema } from '../../../common/rest/dtos/pagination.dto';
import { createZodDto } from 'nestjs-zod';

const publisherParamsRequestSchema = paginationSchema.extend({
  searchQuery: z.string().trim().nullish(),
});

export class PublisherParamsRequestDto extends createZodDto(
  publisherParamsRequestSchema,
) {}
