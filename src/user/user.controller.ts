import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserEntity>> {
    const data = await this.userService.create(createUserDto);
    return { success: true, data };
  }

  @Get()
  async findAll(): Promise<ApiResponse<UserEntity[]>> {
    const data = await this.userService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserEntity>> {
    const data = await this.userService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserEntity>> {
    const data = await this.userService.update(id, updateUserDto);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<boolean>> {
    const data = await this.userService.remove(id);
    return { success: true, data };
  }
}
