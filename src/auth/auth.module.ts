import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '../config/config.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { LocalUserStrategy } from './strategies/local-user.strategy';
import { UserModule } from '../user/user.module';
import { AuthValidateService } from './auth-validate.service';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthRoleGuard } from './guards/auth-global.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: new ConfigService().getJwtConfig.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtUserStrategy,
    LocalUserStrategy,
    AuthValidateService,
    {
      provide: APP_GUARD,
      useFactory: (reflector, authValidateService) => new AuthRoleGuard(reflector, authValidateService),
      inject: [Reflector, AuthValidateService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
