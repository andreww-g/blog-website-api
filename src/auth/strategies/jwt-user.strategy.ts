import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { clone } from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenTypeEnum } from '../../common/enums/auth-token-type.enum';
import { ConfigService } from '../../config/config.service';
import { JwtUserPayloadType } from '../types/jwt-user-payload.type';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    const config = new ConfigService();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getJwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: unknown) {
    if (!this.isUserJwtPayload(payload)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (payload.type !== AuthTokenTypeEnum.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findOneById(payload.sub);

    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
    };
  }

  private isUserJwtPayload(userPayload: unknown): userPayload is JwtUserPayloadType {
    if (typeof userPayload !== 'object' || userPayload === null) {
      return false;
    }

    const copy = clone(userPayload) as JwtUserPayloadType;

    return (
      typeof copy.sub === 'string' &&
      typeof copy.email === 'string' &&
      typeof copy.type === 'string' &&
      typeof copy.role === 'string'
    );
  }
}
