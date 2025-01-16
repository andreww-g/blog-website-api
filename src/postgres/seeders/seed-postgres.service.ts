import { faker } from '@faker-js/faker/locale/ar';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleEntity } from '../../article/entities/article.entity';
import { ArticleCategoryEntity } from '../../article-category/entities/article-category.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PublisherContactInfoEntity } from '../../publishers/entities/publisher-contact-info.entity';

import { articleCategories } from './data/article-categories';
import { articles } from './data/articles';
import { publishers } from './data/publishers';
import { users } from './data/users';

@Injectable()
export class SeedPostgresService {
  private readonly logger = new Logger(SeedPostgresService.name);

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
    try {
      this.logger.log('Starting database refresh...');

      await this.clearTables();

      // Seed in correct order to maintain referential integrity
      await this.seedUsers();
      await this.seedArticleCategories();
      await this.seedPublishersWithRelations();
      await this.seedArticlesWithRelations();

      this.logger.log('Database refresh completed successfully');
    } catch (error) {
      this.logger.error(`Failed to refresh database: ${error.message}`);
      throw error;
    }
  }

  private async clearTables() {
    this.logger.log('Clearing existing data...');

    // Clear in reverse order of dependencies
    await Promise.all([this.articleEntityRepository.delete({}), this.publisherContactInfoEntityRepository.delete({})]);

    await Promise.all([this.publisherEntityRepository.delete({}), this.articleCategoryEntityRepository.delete({})]);

    await this.userEntityRepository.delete({});
  }

  private async seedUsers() {
    try {
      this.logger.log(`Seeding ${users.length} users...`);
      await this.userEntityRepository.insert(users);
    } catch (error) {
      this.logger.error(`Failed to seed users: ${error.message}`);
      throw error;
    }
  }

  private async seedPublishersWithRelations() {
    try {
      this.logger.log(`Seeding ${publishers.length} publishers...`);
      const savedPublishers = await this.publisherEntityRepository.save(publishers);

      this.logger.log('Creating publisher contact info...');
      const contactInfoPromises = savedPublishers.map((publisher) => {
        const contactInfo = {
          id: faker.string.uuid(),
          instagram: `https://instagram.com/${faker.internet.username()}`,
          facebook: `https://facebook.com/${faker.internet.username()}`,
          telegram: `https://t.me/${faker.internet.username()}`,
          publisherId: publisher.id,
          publisher,
        };

        return this.publisherContactInfoEntityRepository.insert(contactInfo);
      });

      await Promise.all(contactInfoPromises);
    } catch (error) {
      this.logger.error(`Failed to seed publishers: ${error.message}`);
      throw error;
    }
  }

  private async seedArticleCategories() {
    try {
      this.logger.log(`Seeding ${articleCategories.length} article categories...`);
      await this.articleCategoryEntityRepository.insert(articleCategories);
    } catch (error) {
      this.logger.error(`Failed to seed article categories: ${error.message}`);
      throw error;
    }
  }

  private async seedArticlesWithRelations() {
    try {
      this.logger.log(`Seeding ${articles.length} articles...`);
      await this.articleEntityRepository.insert(articles);
    } catch (error) {
      this.logger.error(`Failed to seed articles: ${error.message}`);
      throw error;
    }
  }
}
