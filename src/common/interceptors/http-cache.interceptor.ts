import { CACHE_KEY_METADATA, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  #reflector: Reflector = new Reflector();

  constructor () {
    super(CACHE_MANAGER, new Reflector());
  }
  trackBy (context: ExecutionContext): string | undefined {
    const cacheKey = this.#reflector.get(
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
