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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dtos/request/create-author.dto';
import { UpdateAuthorDto } from './dtos/request/update-author.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { AuthorEntity } from './entities/author.entity';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  async create(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<ApiResponse<AuthorEntity>> {
    const data = await this.authorService.create(createAuthorDto);
    return { success: true, data };
  }

  @Get()
  async findAll(): Promise<ApiResponse<AuthorEntity[]>> {
    const data = await this.authorService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AuthorEntity>> {
    const data = await this.authorService.findOneById(id);
    return { success: true, data };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<ApiResponse<AuthorEntity>> {
    const data = await this.authorService.update(id, updateAuthorDto);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<boolean>> {
    const data = await this.authorService.remove(id);
    return { success: true, data };
  }
}
