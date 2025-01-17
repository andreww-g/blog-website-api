import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthTokenTypeEnum } from '../common/enums/auth-token-type.enum';
import { UserRoleEnum } from '../common/enums/user-role.enum';
import { PasswordService } from '../common/services/password.service';
import { tryCatch } from '../common/utils/try-catch';
import { ConfigService } from '../config/config.service';

import { JwtTokensDto } from './dtos/response/jwt-tokens.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  #config = new ConfigService();
  private readonly jwtAccessExpiresIn = this.#config.jwtParams.tokenTTL.access;
  private readonly jwtRefreshExpiresIn = this.#config.jwtParams.tokenTTL.refresh;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginUser(data: { email: string; password: string }): Promise<JwtTokensDto> {
    const { email, password } = data;
    const user = await this.userService.findOneByEmail(email);

    await this.checkCredentials(user, password);

    return await this.generateTokenPairAuthor(user);
  }

  async refreshAccessToken(refreshToken: string): Promise<JwtTokensDto> {
    const { data, error } = await tryCatch(async () => {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== 'refresh') throw new Error('You must provide refresh token. Access token was provided.');

      const user = await this.userService.findOneById(decoded.userId);

      return this.generateTokenPairAuthor(user);
    });

    if (error) throw new UnauthorizedException('Invalid refresh token');
    if (!data) throw new InternalServerErrorException('Something went wrong during refreshing');

    return data;
  }

  private async checkCredentials(user: UserEntity, password: string) {
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.deletedAt) {
      throw new ForbiddenException(`User with email ${user.email} was deleted`);
    }

    if (!(await PasswordService.comparePassword(password, user.password))) {
      throw new UnauthorizedException();
    }
  }

  private async generateTokenPairAuthor(user: UserEntity): Promise<JwtTokensDto> {
    return {
      accessToken: this.jwtService.sign(...this.getTokenPairOptions(user, 'access')),
      refreshToken: this.jwtService.sign(...this.getTokenPairOptions(user, 'refresh')),
    };
  }

  private getTokenPairOptions(user: UserEntity, type: 'access' | 'refresh'): [object, object] {
    const basePayload = {
      sub: user.id,
      email: user.email,
      role: UserRoleEnum.CLIENT,
      type: type === 'access' ? AuthTokenTypeEnum.ACCESS : AuthTokenTypeEnum.REFRESH,
    };

    if (type === 'access') return [basePayload, { expiresIn: this.jwtAccessExpiresIn }];
    if (type === 'refresh') return [basePayload, { expiresIn: this.jwtRefreshExpiresIn }];

    throw new InternalServerErrorException('Invalid token type');
  }
}
