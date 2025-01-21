import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { JwtUserPayloadType } from './types/jwt-user-payload.type';
import { AuthTokenTypeEnum } from '../common/enums/auth-token-type.enum';
import { UserRoleEnum } from '../common/enums/user-role.enum';
import { InvalidCredentialsException } from '../common/exceptions/invalid-credentials.credentials';

@Injectable()
export class AuthValidateService {
  #config = new ConfigService();

  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async validate(token: string, type: AuthTokenTypeEnum, role: UserRoleEnum) {
    const payload = await this.verify(token);

    if (type !== payload.type || role !== payload.role) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED);
    }

    const publisher = await this.verifyUser(payload);

    if (!publisher) return null;

    return {
      ...publisher,
      role: payload.role,
    };
  }

  private async verifyUser(payload: JwtUserPayloadType) {
    const user = await this.userService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verify(token: string): Promise<JwtUserPayloadType> {
    let jwtPayload: JwtUserPayloadType;

    try {
      jwtPayload = await this.jwtService.verifyAsync<JwtUserPayloadType>(token, {
        secret: this.#config.getJwtConfig.secret,
      });
    } catch {
      throw new InvalidCredentialsException();
    }

    return jwtPayload;
  }
}
