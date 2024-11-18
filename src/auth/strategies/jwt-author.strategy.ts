import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../../config/config.service';
import { JwtAuthorPayloadType } from '../types/jwt-author-payload.type';
import { AuthorService } from '../../author/author.service';
import { clone } from 'lodash';

@Injectable()
export class JwtAuthorStrategy extends PassportStrategy(
  Strategy,
  'jwt-author',
) {
  constructor(private readonly authorService: AuthorService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: true,
      secretOrKey: new ConfigService().getJwtConfig.secret,
    });
  }

  async validate(payload: unknown) {
    if (!this.isAuthorJwtPayload(payload)) return false;

    const author = await this.authorService.findOneById(payload.authorId);

    if (author.user.email !== payload.email) return false;

    return payload;
  }

  private isAuthorJwtPayload(
    authorPayload: unknown,
  ): authorPayload is JwtAuthorPayloadType {
    if (typeof authorPayload !== 'object' || authorPayload === null)
      return false;

    const copy = clone(authorPayload) as JwtAuthorPayloadType;

    if (typeof copy.authorId !== 'string') return false;
    return typeof copy.email === 'string';
  }
}
