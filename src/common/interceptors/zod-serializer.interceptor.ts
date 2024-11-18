import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { map, Observable } from 'rxjs';

@Injectable()
export class AppZodSerializerInterceptor extends ZodSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();

    return super.intercept(context, next).pipe(
      map((data) => {
        if (!data || !('success' in data)) return data;
        return {
          ...data,
          timeTakenMs: Date.now() - startTime,
        };
      }),
    );
  }
}
