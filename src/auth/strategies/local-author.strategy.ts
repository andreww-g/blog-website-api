import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthorService } from '../../authors/author.service';
import { PasswordService } from '../../common/services/password.service';
import { tryCatch } from '../../common/utils/try-catch';


@Injectable()
export class LocalAuthorStrategy extends PassportStrategy(Strategy, 'local') {
  private strategyFailureMessage = 'Something went wrong during local strategy validation';

  constructor (private readonly authorService: AuthorService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate (email: string, password: string) {
    const { data: author, error } = await tryCatch(() => this.authorService.findOneByEmail(email));

    if (error) throw new InternalServerErrorException(this.strategyFailureMessage);
    if (!author) throw new InternalServerErrorException(this.strategyFailureMessage);

    const doPasswordsMatch = await PasswordService.comparePassword(password, author.user.password);

    if (!doPasswordsMatch) throw new UnauthorizedException(this.strategyFailureMessage);

    return author;
  }
}
