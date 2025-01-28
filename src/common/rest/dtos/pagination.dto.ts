import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { SortOrderEnum } from '../../enums/sort-order.enum';


export const paginationSchema = z.object({
  skip: z.preprocess(Number, z.number().int().min(0)),
  take: z.preprocess(Number, z.number().int().min(1).max(1000)),
});

export class PaginationDto extends createZodDto(paginationSchema) {}
export class PaginationWithOrderDto extends createZodDto(
  paginationSchema.extend({
    sortOrder: z.nativeEnum(SortOrderEnum).optional(),
  }),
) {}
