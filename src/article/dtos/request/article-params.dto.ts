import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { SortOrderEnum } from '../../../common/enums/sort-order.enum';
import { paginationSchema } from '../../../common/rest/dtos/pagination.dto';
import { valueToBoolean } from '../../../common/utils/value-to-boolean';


const articleParamsSchema = paginationSchema.extend({
  sortOrder: z.nativeEnum(SortOrderEnum).optional(),
  onlyPublished: z.preprocess(valueToBoolean, z.boolean()).optional(),
});

export class ArticleParamsDto extends createZodDto(articleParamsSchema) {}
