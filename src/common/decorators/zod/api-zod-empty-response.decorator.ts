import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ZodSerializerDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';


export const ApiZodEmptyResponse = () => {
  const response = z.object({
    success: z.boolean().refine((value) => !!value, 'Success must be true'),
  });

  return applyDecorators(
    ApiResponse({ schema: zodToOpenAPI(response) }),
    ZodSerializerDto(response),
  );
};
