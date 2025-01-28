import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLISHER_AUTH } from '../../common/constants/auth';
import { AuthTokenTypeEnum } from '../../common/enums/auth-token-type.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { IAuthUser } from '../../common/interfaces/auth/auth-user.interface';
import { AuthValidateService } from '../auth-validate.service';
import { InvalidCredentialsException } from '../../common/exceptions/invalid-credentials.credentials';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authValidateService: AuthValidateService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const isPublisherAuthRequired =
      this.reflector.get<boolean>(IS_PUBLISHER_AUTH, context.getHandler()) ||
      this.reflector.get<boolean>(IS_PUBLISHER_AUTH, context.getClass());

    if (!isPublisherAuthRequired) return true;

    const authHeader = request.headers['authorization'];
    const accessToken = authHeader?.match(/Bearer ([\w.-]*)/i)[1] ?? request.query['_accessToken'];

    if (!accessToken) {
      throw new InvalidCredentialsException();
    }

    if (isPublisherAuthRequired) {
      const id = await this.authorizePublisher(context, accessToken);

      request.user = { id, role: UserRoleEnum.PUBLISHER } as IAuthUser;
    }

    return true;
  }

  private async authorizePublisher(context: ExecutionContext, accessToken: string) {
    const publisher = await this.authValidateService.validate(
      accessToken,
      AuthTokenTypeEnum.ACCESS,
      UserRoleEnum.PUBLISHER,
    );

    if (!publisher) {
      throw new InvalidCredentialsException();
    }

    return publisher.id;
  }
}
