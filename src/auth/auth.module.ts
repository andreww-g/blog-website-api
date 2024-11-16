import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CharactersModule } from '../characters/characters.module';
import { ConfigService } from '../config/config.service';


import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtCharacterStrategy } from './strategies/jwt-character.strategy';
import { LocalAdminStrategy } from './strategies/local-character.strategy';


@Module({
  imports: [
    CharactersModule,
    PassportModule,
    JwtModule.register({
      secret: (new ConfigService()).jwtParams.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtCharacterStrategy,
    LocalAdminStrategy,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
