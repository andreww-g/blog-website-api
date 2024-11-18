import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCache } from 'cache-manager';
import { DeepPartial, IsNull, Not, Repository } from 'typeorm';

import { SortOrderEnum } from '../common/enums/sort-order.enum';

import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  #cacheManager = createCache({});

  constructor (
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle (
    data: DeepPartial<ArticleEntity>,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.save(data);

    return this.findOneById(article.id);
  }

  async updateArticle (
    id: string,
    data: DeepPartial<ArticleEntity>,
  ): Promise<ArticleEntity> {
    const article = await this.findOneById(id);

    if (!article) {
      throw new NotFoundException(`Article with id: ${id} not found`);
    }

    await this.articleRepository.update(id, data);
    return this.findOneById(id);
  }

  async deleteArticle (id: string) {
    const article = await this.findOneById(id);

    if (!article) throw new Error(`Article with id: ${id} not found`);

    await this.articleRepository.softDelete(id);

    return article;
  }

  async publishArticle (id: string) {
    await this.articleRepository.update(id, { publishedAt: new Date() });

    return this.findOneById(id);
  }

  async unpublishArticle (id: string) {
    await this.articleRepository.update(id, { publishedAt: null });

    return this.findOneById(id);
  }

  async findOneById (
    id: string,
    options?: { onlyPublished?: boolean },
  ): Promise<ArticleEntity> {
    const { onlyPublished } = options || {};

    const conditions = onlyPublished
      ? { id, publishedAt: Not(IsNull()) }
      : { id };

    return this.articleRepository.findOneByOrFail(conditions);
  }

  async findOneBySlug (slug: string) {
    return this.articleRepository.findOneByOrFail({ slug });
  }

  async getArticles (options: {
    skip?: number,
    take?: number,
    sortOrder?: SortOrderEnum,
    onlyPublished?: boolean,
  }) {
    options.sortOrder ||= SortOrderEnum.DESC;
    const { skip, take, sortOrder, onlyPublished } = options;

    const [result, total] = await this.articleRepository
      .createQueryBuilder('article')
      .offset(skip)
      .limit(take)
      .orderBy({ 'article.createdAt': sortOrder })
      .andWhere(onlyPublished ? 'article.publishedAt IS NOT NULL' : '1=1')
      .getManyAndCount();

    return { data: result, total };
  }

  async getRecommendations (id: string): Promise<ArticleEntity[]> {
    const article = await this.findOneById(id, { onlyPublished: true });

    if (!article) throw new Error(`Article with id: ${id} not found`);

    const articles = await this.#cacheManager.wrap(
      `article-recommendations-${id}`,
      async () => {
        return this.articleRepository
          .createQueryBuilder('article')
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

  private mapStringToDateInstance (entity: ArticleEntity) {
    return {
      ...entity,
      publishedAt: entity.publishedAt ? new Date(entity.publishedAt) : null,
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt) : null,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt),
    };
  }
}
