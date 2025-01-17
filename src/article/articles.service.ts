import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCache } from 'cache-manager';
import { DeepPartial, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import * as _ from 'lodash';

import { SortOrderEnum } from '../common/enums/sort-order.enum';

import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  #cacheManager = createCache({});

  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(data: DeepPartial<ArticleEntity>): Promise<ArticleEntity> {
    const article = await this.articleRepository.save(data);

    return this.findOneById(article.id);
  }

  async updateArticle(id: string, data: DeepPartial<ArticleEntity>): Promise<ArticleEntity> {
    const article = await this.findOneById(id);

    if (!article) {
      throw new NotFoundException(`Article with id: ${id} not found`);
    }

    await this.articleRepository.update(id, data);
    return this.findOneById(id);
  }

  async deleteArticle(id: string) {
    const article = await this.findOneById(id);

    if (!article) throw new Error(`Article with id: ${id} not found`);

    await this.articleRepository.softDelete(id);

    return article;
  }

  async publishArticle(id: string) {
    await this.articleRepository.update(id, { publishedAt: new Date() });

    return this.findOneById(id);
  }

  async unpublishArticle(id: string) {
    await this.articleRepository.update(id, { publishedAt: null });

    return this.findOneById(id);
  }

  async findOneById(id: string, options?: { onlyPublished?: boolean }): Promise<ArticleEntity> {
    const { onlyPublished } = options || {};
    const conditions: FindOptionsWhere<ArticleEntity> = { id };

    conditions['publishedAt'] = onlyPublished ? Not(IsNull()) : IsNull();

    return this.articleRepository.findOneOrFail({
      where: conditions,
      relations: ['publisher', 'category'],
    });
  }

  async findOneBySlug(slug: string, options?: { onlyPublished?: boolean }) {
    const { onlyPublished } = options || {};

    const conditions: FindOptionsWhere<ArticleEntity> = { slug };

    if (typeof onlyPublished === 'boolean') {
      conditions['publishedAt'] = onlyPublished ? Not(IsNull()) : IsNull();
    }

    return this.articleRepository.findOneOrFail({
      where: conditions,
      relations: ['publisher', 'category'],
    });
  }

  async getArticles(options: { skip?: number; take?: number; sortOrder?: SortOrderEnum; onlyPublished?: boolean }) {
    options.sortOrder ||= SortOrderEnum.DESC;
    const { skip, take, sortOrder, onlyPublished } = options;

    const [result, total] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .offset(skip)
      .limit(take)
      .orderBy({ 'article.createdAt': sortOrder })
      .andWhere(onlyPublished ? 'article.publishedAt IS NOT NULL' : '1=1')
      .getManyAndCount();

    return { data: result, total };
  }

  async getRelatedArticles(id: string): Promise<ArticleEntity[]> {
    const article = await this.findOneById(id, { onlyPublished: true });

    if (!article) throw new Error(`Article with id: ${id} not found`);
    if (!article.categoryId) throw new Error(`Category ID for article ${id} is undefined`);

    const articles = await this.#cacheManager.wrap(
      `article-relative-${id}`,
      async () => {
        const query = this.articleRepository
          .createQueryBuilder('article')
          .leftJoinAndSelect('article.category', 'category')
          .leftJoinAndSelect('article.publisher', 'publisher')
          .leftJoinAndSelect('publisher.user', 'user')
          .leftJoinAndSelect('publisher.avatar', 'avatar')
          .andWhere('article.id != :id', { id })
          .andWhere('article.publishedAt IS NOT NULL')
          .andWhere('category.id = :categoryId', { categoryId: article.categoryId })
          .orderBy('article.createdAt', 'DESC')
          .take(20);

        const rawArticles = await query.getMany();
        return _.shuffle(rawArticles).slice(0, 5);
      },
      24 * 60 * 60,
    );

    return articles.map((a) => this.mapStringToDateInstance(a)) || [];
  }

  async getRecommendations(id: string): Promise<ArticleEntity[]> {
    const article = await this.findOneById(id, { onlyPublished: true });

    if (!article) throw new Error(`Article with id: ${id} not found`);

    const articles = await this.#cacheManager.wrap(
      `article-recommendations-${id}`,
      async () => {
        return this.articleRepository
          .createQueryBuilder('article')
          .leftJoinAndSelect('article.category', 'category')
          .leftJoinAndSelect('article.publisher', 'publisher')
          .leftJoinAndSelect('publisher.user', 'user')
          .orderBy('RANDOM()')
          .andWhere('article.id != :id', { id })
          .andWhere('article.publishedAt IS NOT NULL')
          .take(5)
          .getMany();
      },
      24 * 60 * 60,
    );

    const mappedArticles = articles.map((a) => this.mapStringToDateInstance(a));

    return mappedArticles || [];
  }

  private mapStringToDateInstance(entity: ArticleEntity) {
    return {
      ...entity,
      publishedAt: entity.publishedAt ? new Date(entity.publishedAt) : null,
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt) : null,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt),
    };
  }
}
