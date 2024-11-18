import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import {
  AuthorResponseDto,
  authorResponseSchema,
} from './dtos/response/author-response.dto';
import { AuthorCreateRequestDto } from './dtos/request/author-create-request.dto';
import { ApiZodResponse } from '../common/decorators/zod/api-zod-response.decorator';
import { ApiZodEmptyResponse } from '../common/decorators/zod/api-zod-empty-response.decorator';
import { plainToInstance } from 'class-transformer';
import { ApiZodPaginatedResponse } from '../common/decorators/zod/api-zod-paginated-response.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Author')
@Controller('/public/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiZodResponse(authorResponseSchema)
  async create(
    @Body() payload: AuthorCreateRequestDto,
  ): Promise<ApiResponse<AuthorResponseDto>> {
    const data = await this.authorService.create(payload);
    return { success: true, data: plainToInstance(AuthorResponseDto, data) };
  }

  @Get()
  @ApiZodPaginatedResponse(authorResponseSchema)
  async findAll(): Promise<ApiResponse<AuthorResponseDto[]>> {
    const data = await this.authorService.findAll();
    return { success: true, data: plainToInstance(AuthorResponseDto, data) };
  }

  @Get(':id')
  @ApiZodResponse(authorResponseSchema)
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<AuthorResponseDto>> {
    const data = await this.authorService.findOneById(id);
    return { success: true, data: plainToInstance(AuthorResponseDto, data) };
  }

  @Patch(':id')
  @ApiZodResponse(authorResponseSchema)
  async update(
    @Param('id') id: string,
    @Body() payload: AuthorCreateRequestDto,
  ): Promise<ApiResponse<AuthorResponseDto>> {
    const data = await this.authorService.update(id, payload);
    return { success: true, data: plainToInstance(AuthorResponseDto, data) };
  }

  @Delete(':id')
  @ApiZodEmptyResponse()
  async remove(@Param('id') id: string): Promise<ApiResponse<object>> {
    await this.authorService.remove(id);
    return { success: true, data: {} };
  }
}
