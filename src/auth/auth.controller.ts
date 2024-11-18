import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

import { ApiZodResponse } from '../common/decorators/zod/api-zod-response.decorator';

import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dtos/request/login-payload.dto';
import {
  RefreshTokenDto,
  refreshTokenSchema,
} from './dtos/request/refresh-token.dto';
import { JwtTokensDto, jwtTokensSchema } from './dtos/response/jwt-tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @ApiZodResponse(jwtTokensSchema)
  @Post('login')
  async login (
    @Body() { email, password }: LoginPayloadDto,
  ): Promise<{ success: true, data: JwtTokensDto }> {
    const data = await this.authService.loginAuthor({ email, password });

    return { success: true, data };
  }

  @ApiZodResponse(jwtTokensSchema)
  @Post('refresh-token')
  @ApiBody({ schema: zodToOpenAPI(refreshTokenSchema) })
  async refreshTokens (
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<{ success: true, data: JwtTokensDto }> {
    const data = await this.authService.refreshAccessToken(refreshToken);

    return { success: true, data };
  }
}
