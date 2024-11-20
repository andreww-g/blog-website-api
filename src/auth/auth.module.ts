import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthorModule } from '../authors/author.module';
import { ConfigService } from '../config/config.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthorStrategy } from './strategies/jwt-author.strategy';
import { LocalAuthorStrategy } from './strategies/local-author.strategy';


@Module({
  imports: [
    AuthorModule,
    PassportModule,
    JwtModule.register({
      secret: new ConfigService().getJwtConfig.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthorStrategy, LocalAuthorStrategy],
  exports: [AuthService],
})
export class AuthModule {}
