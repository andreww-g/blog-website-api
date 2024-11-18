import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthorService } from '../author/author.service';
import { AuthorEntity } from '../author/entities/author.entity';
import { PasswordService } from '../common/services/password.service';
import { tryCatch } from '../common/utils/try-catch';
import { ConfigService } from '../config/config.service';

import { JwtTokensDto } from './dtos/response/jwt-tokens.dto';

@Injectable()
export class AuthService {
  #config = new ConfigService();
  private readonly jwtExpiresIn = this.#config.jwtParams.tokenTTL.access;
  private readonly jwtRefreshExpiresIn =
    this.#config.jwtParams.tokenTTL.refresh;

  constructor (
    private readonly jwtService: JwtService,
    private readonly authorService: AuthorService,
  ) {}

  async loginAuthor (data: {
    email: string,
    password: string,
  }): Promise<JwtTokensDto> {
    const { email, password } = data;
    const author = await this.authorService.findOneByEmail(email);

    console.log(data);
    await this.checkCredentials(author, password);

    return this.generateTokenPairAuthor(author);
  }

  async refreshAccessToken (refreshToken: string): Promise<JwtTokensDto> {
    const { data, error } = await tryCatch(async () => {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== 'refresh') {
        throw new Error(
          'You must provide refresh token. Access token was provided.',
        );
      }

      const user = await this.authorService.findOneById(decoded.userId);

      return this.generateTokenPairAuthor(user);
    });

    if (error) throw new UnauthorizedException('Invalid refresh token');
    if (!data) {
      throw new InternalServerErrorException(
        'Something went wrong during refreshing',
      );
    }

    return data;
  }

  private async checkCredentials (author: AuthorEntity, password: string) {
    if (!author) {
      throw new UnauthorizedException();
    }

    if (author.deletedAt) {
      throw new ForbiddenException(
        `Author with email ${author.user.email} was deleted`,
      );
    }

    if (
      !(await PasswordService.comparePassword(password, author.user.password))
    ) {
      throw new UnauthorizedException();
    }
  }

  private async generateTokenPairAuthor (
    author: AuthorEntity,
  ): Promise<JwtTokensDto> {
    const payloadAuthor = {
      authorId: author.id,
      email: author.user.email,
    };

    return {
      accessToken: this.jwtService.sign(payloadAuthor, {
        expiresIn: this.jwtExpiresIn,
      }),
      refreshToken: this.jwtService.sign(payloadAuthor, {
        expiresIn: this.jwtRefreshExpiresIn,
      }),
    };
  }
}
