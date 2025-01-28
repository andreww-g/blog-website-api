import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { paginationSchema } from '../../../common/rest/dtos/pagination.dto';


const publisherParamsRequestSchema = paginationSchema.extend({
  searchQuery: z.string().trim().nullish(),
});

export class PublisherParamsRequestDto extends createZodDto(
  publisherParamsRequestSchema,
) {}
