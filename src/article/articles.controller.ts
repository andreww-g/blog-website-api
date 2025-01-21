import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { z } from 'nestjs-zod/z';

import { ApiZodEmptyResponse } from '../common/decorators/zod/api-zod-empty-response.decorator';
import { ApiZodPaginatedResponse } from '../common/decorators/zod/api-zod-paginated-response.decorator';
import { ApiZodResponse } from '../common/decorators/zod/api-zod-response.decorator';
import { ZodQuery } from '../common/decorators/zod/zod-query.decorator';

import { ArticlesService } from './articles.service';
import { ArticleByIdRequestDto } from './dtos/request/article-by-id-request.dto';
import { ArticleParamsDto } from './dtos/request/article-params.dto';
import { ArticleQueryDto } from './dtos/request/article-query.dto';
import { CreateArticleDto } from './dtos/request/create-article.dto';
import { UpdateArticleDto } from './dtos/request/update-article.dto';
import { ArticleResponseDto, articleResponseSchema } from './dtos/response/article-response.dto';
import { AuthPublisher } from '../common/decorators/publisher/auth-publisher.decorator';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post()
  @AuthPublisher()
  @ApiZodResponse(articleResponseSchema)
  async createArticle(@Body() payload: CreateArticleDto): Promise<{ success: true; data: ArticleResponseDto }> {
    const article = await this.articleService.createArticle(payload);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Patch(':id')
  @ApiZodResponse(articleResponseSchema)
  @AuthPublisher()
  async updateArticle(
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
    @Body() payload: UpdateArticleDto,
  ): Promise<{ success: true; data: ArticleResponseDto }> {
    const article = await this.articleService.updateArticle(id, payload);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Delete(':id')
  @AuthPublisher()
  @ApiZodResponse(articleResponseSchema)
  async deleteArticle(@Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id']): Promise<{ success: true }> {
    await this.articleService.deleteArticle(id);

    return { success: true };
  }

  @Post(':id/publish')
  @AuthPublisher()
  @ApiZodEmptyResponse()
  async publishArticle(
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
  ): Promise<{ success: true; data: ArticleResponseDto }> {
    const article = await this.articleService.publishArticle(id);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Post(':id/unpublish')
  @AuthPublisher()
  @ApiZodResponse(articleResponseSchema)
  async unpublishArticle(
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
  ): Promise<{ success: true; data: ArticleResponseDto }> {
    const article = await this.articleService.unpublishArticle(id);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Get(':id')
  @ApiZodResponse(articleResponseSchema)
  async getArticleById(
    @Param('id', ParseUUIDPipe) id: ArticleByIdRequestDto['id'],
    @ZodQuery() query: ArticleQueryDto,
  ): Promise<{ success: true; data: ArticleResponseDto }> {
    const article = await this.articleService.findOneById(id, query);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Get('by-slug/:slug')
  @ApiZodResponse(articleResponseSchema)
  async getArticleBySlug(
    @Param('slug') slug: string,
    @ZodQuery() query: ArticleQueryDto,
  ): Promise<{ success: true; data: ArticleResponseDto }> {
    const article = await this.articleService.findOneBySlug(slug, query);

    return { success: true, data: plainToInstance(CreateArticleDto, article) };
  }

  @Get()
  @ApiZodPaginatedResponse(articleResponseSchema)
  async getArticles(
    @ZodQuery() params: ArticleParamsDto,
  ): Promise<{ success: true; data: ArticleResponseDto[]; total: number; skip: number; take: number }> {
    const { data, total } = await this.articleService.getArticles(params);

    return {
      success: true,
      data: data.map((a) => plainToInstance(CreateArticleDto, a)),
      total,
      skip: params.skip,
      take: params.take,
    };
  }

  @Get(':id/related')
  @ApiZodResponse(z.array(articleResponseSchema))
  async getRelatedArticles(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true; data: ArticleResponseDto[] }> {
    const data = await this.articleService.getRelatedArticles(id);

    return { success: true, data: data.map((rec) => plainToInstance(ArticleResponseDto, rec)) };
  }

  @Get(':id/recommendations')
  @ApiZodResponse(z.array(articleResponseSchema))
  async getRecommendations(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true; data: ArticleResponseDto[] }> {
    const recommendations = await this.articleService.getRecommendations(id);

    return { success: true, data: recommendations.map((rec) => plainToInstance(ArticleResponseDto, rec)) };
  }
}
