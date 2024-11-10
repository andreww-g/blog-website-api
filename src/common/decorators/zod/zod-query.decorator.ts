import 'reflect-metadata';
import { Query } from '@nestjs/common';
import { ApiParam, ApiParamOptions } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';


export const ZodQuery = () => {
  return (target: unknown, key: string, descriptor: number) => {
    if (!target || !key) return;
    Query()(target, key, descriptor);

    const argType = Reflect.getMetadata('design:paramtypes', target, key)[descriptor];
    const schema = argType?.schema;

    if (!schema) throw new Error('Invalid validation schema');

    const rawOpenApiSchema = zodToOpenAPI(schema);

    if (!rawOpenApiSchema.properties) return;

    const queryParamOpenApiSchemas: ApiParamOptions[] = Object.keys(rawOpenApiSchema.properties).map((name) => ({
      in: 'query',
      name,
      required: rawOpenApiSchema.required?.includes(name) ?? false,
      schema: rawOpenApiSchema.properties?.[name],
    }));

    const decorators = queryParamOpenApiSchemas.map((item) => ApiParam(item));

    decorators.map((decorator) => decorator(target[key], key, Object.getOwnPropertyDescriptor(target, key) as TypedPropertyDescriptor<any>));
  };
};
