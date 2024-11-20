import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { clone } from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthorService } from '../../authors/author.service';
import { AuthTokenTypeEnum } from '../../common/enums/auth-token-type.enum';
import { ConfigService } from '../../config/config.service';
import { JwtAuthorPayloadType } from '../types/jwt-author-payload.type';


@Injectable()
export class JwtAuthorStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor (private readonly authorService: AuthorService) {
    const config = new ConfigService();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getJwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate (payload: unknown) {
    if (!this.isAuthorJwtPayload(payload)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.type !== AuthTokenTypeEnum.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    const author = await this.authorService.findOneById(payload.sub);

    if (!author || author.id !== payload.sub) {
      throw new UnauthorizedException('User not found');
    }

    return {
      authorId: author.id,
      email: author.user.email,
    };
  }

  private isAuthorJwtPayload (
    authorPayload: unknown,
  ): authorPayload is JwtAuthorPayloadType {
    if (typeof authorPayload !== 'object' || authorPayload === null) {
      return false;
    }

    const copy = clone(authorPayload) as JwtAuthorPayloadType;

    return (
      typeof copy.sub === 'string' &&
      typeof copy.email === 'string' &&
      typeof copy.type === 'string' &&
      typeof copy.role === 'string'
    );
  }
}
