import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '../config/config.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { LocalUserStrategy } from './strategies/local-user.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: new ConfigService().getJwtConfig.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtUserStrategy, LocalUserStrategy],
  exports: [AuthService],
})
export class AuthModule {}
