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
export class LocalAuthorStrategy extends PassportStrategy(Strategy, 'local-author') {
  constructor(private readonly authorService: AuthorService) {
    super({ usernameField: 'nickName' });
  }

  async validate(email: string, password: string) {
    const { data: author, error } = await tryCatch(() =>
      this.authorService.findOneByEmail(email),
    );

    if (error) throw error;
    if (!author)
      throw new InternalServerErrorException(
        'Something went wrong during local strategy validation',
      );

    const doesMatch = await PasswordService.comparePassword(
      password,
      author.user.password,
    );

    if (!doesMatch) throw new UnauthorizedException();

    return author;
  }
}
