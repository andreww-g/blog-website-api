import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ApiZodEmptyResponse } from '../common/decorators/zod/api-zod-empty-response.decorator';
import { ApiZodResponse } from '../common/decorators/zod/api-zod-response.decorator';
import { ApiResponse } from '../common/interfaces/api-response.interface';

import { UserByIdRequestDto } from './dtos/request/user-by-id-request.dto';
import { UserCreateRequestDto } from './dtos/request/user-create-request.dto';
import { UserUpdateRequestDto } from './dtos/request/user-update-request.dto';
import { UserResponseDto, userResponseSchema } from './dtos/response/user-response.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() payload: UserCreateRequestDto): Promise<ApiResponse<UserResponseDto>> {
    const data = await this.userService.create(payload);

    return { success: true, data: plainToInstance(UserResponseDto, data) };
  }

  @ApiZodResponse(userResponseSchema)
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, required: true })
  async findOne(@Param('id') id: UserByIdRequestDto['id']): Promise<ApiResponse<UserResponseDto>> {
    const data = await this.userService.findOneById(id);

    return { success: true, data: plainToInstance(UserResponseDto, data) };
  }

  @ApiZodResponse(userResponseSchema)
  @Patch(':id')
  async update(
    @Param('id') id: UserByIdRequestDto['id'],
    @Body() payload: UserUpdateRequestDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const data = await this.userService.update(id, payload);

    return { success: true, data: plainToInstance(UserResponseDto, data) };
  }

  @ApiZodEmptyResponse()
  @Delete(':id')
  async remove(@Param('id') id: UserByIdRequestDto['id']): Promise<ApiResponse<object>> {
    await this.userService.remove(id);

    return { success: true, data: {} };
  }
}
