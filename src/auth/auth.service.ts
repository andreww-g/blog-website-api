import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CharactersService } from '../characters/characters.service';
import { CharacterEntity } from '../characters/entities/character.entity';
import { PasswordService } from '../common/services/password.service';
import { tryCatch } from '../common/utils/try-catch';

import { JwtTokensDto } from './dtos/response/jwt-tokens.dto';

@Injectable()
export class AuthService {
  private readonly jwtExpiresIn = '2h';
  private readonly jwtRefreshExpiresIn = '7d';

  constructor(
    private readonly jwtService: JwtService,
    private readonly charactersService: CharactersService,
  ) {}

  async loginAdmin(data: {
    nickName: string;
    password: string;
  }): Promise<JwtTokensDto> {
    const { nickName, password } = data;
    const character = await this.charactersService.findOneByNickname(nickName);

    await this.checkCredentials(character, password);

    return this.generateTokenPairCharacter(character);
  }

  async refreshAccessToken(refreshToken: string): Promise<JwtTokensDto> {
    const { data, error } = await tryCatch(async () => {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== 'refresh')
        throw new Error(
          'You must provide refresh token. Access token was provided.',
        );

      const user = await this.charactersService.findOneById(decoded.userId);

      return this.generateTokenPairCharacter(user);
    });

    if (error) throw new UnauthorizedException('Invalid refresh token');
    if (!data)
      throw new InternalServerErrorException(
        'Something went wrong during refreshing',
      );

    return data;
  }

  private async checkCredentials(character: CharacterEntity, password: string) {
    if (!character) {
      throw new UnauthorizedException();
    }

    if (character.deletedAt) {
      throw new ForbiddenException(
        `Character ${character.nickName} was deleted`,
      );
    }

    if (
      !(await PasswordService.comparePassword(password, character.password))
    ) {
      throw new UnauthorizedException();
    }
  }

  private async generateTokenPairCharacter(
    character: CharacterEntity,
  ): Promise<JwtTokensDto> {
    const payloadCharacter = {
      characterId: character.id,
      nickName: character.nickName,
    };

    return {
      accessToken: this.jwtService.sign(payloadCharacter, {
        expiresIn: this.jwtExpiresIn,
      }),
      refreshToken: this.jwtService.sign(payloadCharacter, {
        expiresIn: this.jwtRefreshExpiresIn,
      }),
    };
  }
}
