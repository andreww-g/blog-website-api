import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto, zodToOpenAPI } from 'nestjs-zod';
import { z, ZodSchema } from 'nestjs-zod/z';


export const ApiZodTotalResponseDto = (schema: ZodSchema) => {
  const response = z.object({
    total: z.number(),
    data: z.array(schema),
    success: z.boolean().refine((value) => !!value, 'Success must be true'),
  });

  return applyDecorators(
    ApiResponse({ schema: zodToOpenAPI(response) }),
    ZodSerializerDto(response),
  );
};
