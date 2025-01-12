import { faker } from '@faker-js/faker/locale/ar';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleEntity } from '../../article/entities/article.entity';
import { ArticleCategoryEntity } from '../../article-category/entities/article-category.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';

import { articleCategories } from './data/article-categories';
import { articles } from './data/articles';
import { publishers } from './data/publishers';
import { users } from './data/users';
import { PublisherContactInfoEntity } from '../../publishers/entities/publisher-contact-info.entity';

@Injectable()
export class SeedPostgresService {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(PublisherEntity) private readonly publisherEntityRepository: Repository<PublisherEntity>,
    @InjectRepository(ArticleEntity) private readonly articleEntityRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleCategoryEntity)
    private readonly articleCategoryEntityRepository: Repository<ArticleCategoryEntity>,
    @InjectRepository(PublisherContactInfoEntity)
    private readonly publisherContactInfoEntityRepository: Repository<PublisherContactInfoEntity>,
  ) {}

  async refreshDB() {
    await this.clearTables();

    await this.seedUsers();
    await this.seedArticleCategories();
    await this.seedPublishersWithRelations();
    await this.seedArticlesWithRelations();
  }

  private async clearTables() {
    await this.articleEntityRepository.delete({});
    await this.publisherEntityRepository.delete({});
    await this.publisherContactInfoEntityRepository.delete({});
    await this.articleCategoryEntityRepository.delete({});
    await this.userEntityRepository.delete({});
  }

  private async seedUsers() {
    await this.userEntityRepository.insert(users);
  }

  private async seedPublishersWithRelations() {
    const savedPublishers = await this.publisherEntityRepository.save(publishers);

    for (const publisher of savedPublishers) {
      const contactInfo = {
        id: faker.string.uuid(),
        instagram: faker.internet.url(),
        facebook: faker.internet.url(),
        telegram: faker.internet.url(),
        publisherId: publisher.id,
        publisher,
      };

      await this.publisherContactInfoEntityRepository.insert(contactInfo);
    }
  }

  private async seedArticleCategories() {
    await this.articleCategoryEntityRepository.insert(articleCategories);
  }

  private async seedArticlesWithRelations() {
    const articlesWithoutRelations = articles.map((article) => ({
      ...article,
      publisherId: publishers[0].id,
    }));

    await this.articleEntityRepository.insert(articlesWithoutRelations);
  }
}
