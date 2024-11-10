import { ComparisonOperatorEnum, ConditionTypeEnum, InfluenceTypeEnum } from '@sky-vip/price-calculation-service';
import { z } from 'zod';


export const calculationBlockSchema = z.object({
  title: z.string(),
  conditions: z.array(z.object({
    type: z.nativeEnum(ConditionTypeEnum),
    variables: z.array(z.string()),
    operator: z.nativeEnum(ComparisonOperatorEnum),
    values: z.union([z.array(z.number()), z.array(z.string())]),
  })),
  influence: z.object({
    type: z.nativeEnum(InfluenceTypeEnum),
    number: z.number(),
  }),
  subtraction: z.object({
    sources: z.array(z.string()),
    maxNumber: z.number().nullable(),
  }),
  repeat: z.boolean(),
});
