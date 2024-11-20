import { z } from 'zod';


function isEnum (obj: any): obj is Record<string, string> {
  return (
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.values(obj).every((value) => typeof value === 'string')
  );
}

export function zodArraySchema<T extends z.ZodTypeAny | Record<string, string>> (
  type: T,
) {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        val = val.split(',').map((item) => item.trim());
      }

      const arrayVal = Array.isArray(val)
        ? val.filter(Boolean)
        : [val].filter(Boolean);

      return arrayVal.every((item) => typeof item === 'string')
        ? arrayVal
        : undefined;
    },
    isEnum(type) ? z.array(z.nativeEnum(type)) : z.array(type), // Handle enums and Zod types separately
  );
}
