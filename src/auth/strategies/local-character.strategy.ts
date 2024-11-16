import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { PasswordService } from '../../common/services/password.service';
import { tryCatch } from '../../common/utils/try-catch';
import { AuthorService } from '../../author/author.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-character',
) {
  constructor(private readonly authorService: AuthorService) {
    super({ usernameField: 'nickName' });
  }

  async validate(nickName: string, password: string) {
    const { data: character, error } = await tryCatch(() =>
      this.authorService.findOneByNickname(nickName),
    );

    if (error) throw error;
    if (!character)
      throw new InternalServerErrorException(
        'Something went wrong during local strategy validation',
      );

    const doesMatch = await PasswordService.comparePassword(
      password,
      character.password,
    );

    if (!doesMatch) throw new UnauthorizedException();

    return character;
  }
}
