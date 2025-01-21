import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ApiZodPaginatedResponse } from '../common/decorators/zod/api-zod-paginated-response.decorator';
import { ApiZodResponse } from '../common/decorators/zod/api-zod-response.decorator';
import { ZodQuery } from '../common/decorators/zod/zod-query.decorator';
import { ApiResponse } from '../common/interfaces/api-response.interface';

import { PublisherByIdRequestDto } from './dtos/request/publisher-by-id-request.dto';
import { PublisherCreateRequestDto } from './dtos/request/publisher-create-request.dto';
import { PublisherParamsRequestDto } from './dtos/request/publisher-params-request.dto';
import { PublisherResponseDto, publisherResponseSchema } from './dtos/response/publisher-response.dto';
import { PublisherService } from './publisher.service';
import { AuthUser } from '../common/decorators/auth/auth-user.decorator';
import { IAuthUser } from '../common/interfaces/auth/auth-user.interface';
import { AuthPublisher } from '../common/decorators/publisher/auth-publisher.decorator';
import { UserResponseDto } from '../user/dtos/response/user-response.dto';
import { PublisherUpdateRequestDto } from './dtos/request/publisher-update.dto';

@ApiTags('Publishers')
@Controller('/publishers')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post()
  @ApiZodResponse(publisherResponseSchema)
  async create(@Body() payload: PublisherCreateRequestDto): Promise<ApiResponse<PublisherResponseDto>> {
    const data = await this.publisherService.create(payload.userId, payload.articleIds || []);

    return { success: true, data: plainToInstance(PublisherResponseDto, data) };
  }

  @Patch(':id')
  @ApiZodResponse(publisherResponseSchema)
  async update(
    @Param('id') id: PublisherByIdRequestDto['id'],
    @Body() payload: PublisherUpdateRequestDto,
  ): Promise<ApiResponse<PublisherResponseDto>> {
    const data = await this.publisherService.update(id, payload);
    console.log(data);
    return { success: true, data: plainToInstance(PublisherResponseDto, data) };
  }

  @Get('/auth-profile')
  @AuthPublisher()
  @ApiZodResponse(publisherResponseSchema)
  async findAuthProfile(@AuthUser() user: IAuthUser): Promise<ApiResponse<PublisherResponseDto>> {
    const data = await this.publisherService.findOneByUserId(user.id);

    return { success: true, data: plainToInstance(UserResponseDto, data) };
  }

  @Get(':id')
  @ApiZodResponse(publisherResponseSchema)
  async getPublisher(@Param('id') id: PublisherByIdRequestDto['id']): Promise<ApiResponse<PublisherResponseDto>> {
    const data = await this.publisherService.findOneById(id);

    return { success: true, data: plainToInstance(PublisherResponseDto, data) };
  }

  @Get()
  @ApiZodPaginatedResponse(publisherResponseSchema)
  async getPublishers(
    @ZodQuery() payload: PublisherParamsRequestDto,
  ): Promise<ApiResponse<{ data: PublisherResponseDto[]; total: number }>> {
    const result = await this.publisherService.findAll(payload);

    return {
      success: true,
      data: {
        data: plainToInstance(PublisherResponseDto, result.data),
        total: result.total,
      },
    };
  }
}
