import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthTokenService } from '../../auth/services/auth-token.service';
import { AuthValidateService } from '../../auth/services/auth-validate.service';


export const loggingInterceptorProviders: Provider[] = [
  AuthTokenService,
  AuthValidateService,
  JwtService,
];
