import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { z } from 'nestjs-zod/z';
import { ApiZodEmptyResponse } from '../common/decorators/zod/api-zod-empty-response.decorator';
import { ApiZodPaginatedResponse } from '../common/decorators/zod/api-zod-paginated-response.decorator';
import { ApiZodResponse } from '../common/decorators/zod/api-zod-response.decorator';
import { ArticleService } from './article.service';
import { ArticleByIdRequestDto } from './dtos/request/article-by-id-request.dto';
import { ArticleParamsDto } from './dtos/request/article-params.dto';
import { CreateArticleDto } from './dtos/request/create-article.dto';
import { UpdateArticleDto } from './dtos/request/update-article.dto';
import { ArticleResponseDto, articleResponseSchema } from './dtos/response/article-response.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor (private readonly articleService: ArticleService) {}

  @Post()
  @ApiZodResponse(articleResponseSchema)
  async createArticle (
    @Body() payload: CreateArticleDto,
  ): Promise<{ success: true, data: ArticleResponseDto }> {
    const article = await this.articleService.createArticle(payload);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Patch(':id')
  @ApiZodResponse(articleResponseSchema)
  async updateArticle (
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
    @Body() payload: UpdateArticleDto,
  ): Promise<{ success: true, data: ArticleResponseDto }> {
    const article = await this.articleService.updateArticle(id, payload);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Delete(':id')
  @ApiZodResponse(articleResponseSchema)
  async deleteArticle (
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
  ): Promise<{ success: true }> {
    await this.articleService.deleteArticle(id);

    return { success: true };
  }

  @Post(':id/publish')
  @ApiZodEmptyResponse()
  async publishArticle (
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
  ): Promise<{ success: true, data: ArticleResponseDto }> {
    const article = await this.articleService.publishArticle(id);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Post(':id/unpublish')
  @ApiZodResponse(articleResponseSchema)
  async unpublishArticle (
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
  ): Promise<{ success: true, data: ArticleResponseDto }> {
    const article = await this.articleService.unpublishArticle(id);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Get(':id')
  @ApiZodResponse(articleResponseSchema)
  async getArticleById (
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
    @Query('onlyPublished') onlyPublished?: boolean,
  ): Promise<{ success: true, data: ArticleResponseDto }> {
    const article = await this.articleService.findOneById(id, { onlyPublished });

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Get('by-slug/:slug')
  @ApiZodResponse(articleResponseSchema)
  async getArticleBySlug (
    @Param('slug') slug: string,
  ): Promise<{ success: true, data: ArticleResponseDto }> {
    const article = await this.articleService.findOneBySlug(slug);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Get()
  @ApiZodPaginatedResponse(articleResponseSchema)
  async getArticles (
    @Query() params: ArticleParamsDto,
  ): Promise<{ success: true, data: ArticleResponseDto[], total: number, skip: number, take: number }> {
    const { data, total } = await this.articleService.getArticles(params);

    return { success: true, data: data.map((a) => plainToInstance(CreateArticleDto, a)), total, skip: params.skip, take: params.take };
  }

  @Get(':id/recommendations')
  @ApiZodResponse(z.array(articleResponseSchema))
  async getRecommendations (
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true, data: ArticleResponseDto[] }> {
    const recommendations = await this.articleService.getRecommendations(id);

    return { success: true, data: recommendations.map((rec) => plainToInstance(ArticleResponseDto, rec)) };
  }
}
