import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

import { ApiZodSingleResponseDecorator } from '../common/decorators/zod/api-zod-single-response.decorator';

import { AuthService } from './auth.service';
import { JwtTokensDto, jwtTokensSchema } from './dtos/response/jwt-tokens.dto';
import { LoginPayloadDto, loginSchema } from './dtos/request/login-payload.dto';
import {
  RefreshTokenDto,
  refreshTokenSchema,
} from './dtos/request/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiZodSingleResponseDecorator(jwtTokensSchema)
  @Post('login')
  @ApiBody({ schema: zodToOpenAPI(loginSchema) })
  async login(
    @Body() payload: LoginPayloadDto,
  ): Promise<{ success: true; data: JwtTokensDto }> {
    const data = await this.authService.loginAdmin(payload);

    return { success: true, data };
  }

  @ApiZodSingleResponseDecorator(jwtTokensSchema)
  @Post('refresh-token')
  @ApiBody({ schema: zodToOpenAPI(refreshTokenSchema) })
  async refreshTokens(
    @Body() payload: RefreshTokenDto,
  ): Promise<{ success: true; data: JwtTokensDto }> {
    const data = await this.authService.refreshAccessToken(
      payload.refreshToken,
    );

    return { success: true, data };
  }
}
