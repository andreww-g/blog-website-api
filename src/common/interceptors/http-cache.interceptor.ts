import { CACHE_KEY_METADATA, CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';


@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy (context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    if (cacheKey) {
      return cacheKey;
    }

    if (request.authUser) {
      return `${request.authUser.role}-${request.authUser.id}-${request._parsedUrl.query}`;
    }

    return super.trackBy(context);
  }
}
