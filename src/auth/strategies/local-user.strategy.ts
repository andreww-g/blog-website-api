import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { PasswordService } from '../../common/services/password.service';
import { tryCatch } from '../../common/utils/try-catch';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, 'local') {
  private strategyFailureMessage = 'Something went wrong during local strategy validation';

  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const { data: user, error } = await tryCatch(() => this.userService.findOneByEmail(email));

    if (error) throw new InternalServerErrorException(this.strategyFailureMessage);
    if (!user) throw new InternalServerErrorException(this.strategyFailureMessage);

    const doPasswordsMatch = await PasswordService.comparePassword(password, user.password);

    if (!doPasswordsMatch) throw new UnauthorizedException(this.strategyFailureMessage);

    return user;
  }
}
