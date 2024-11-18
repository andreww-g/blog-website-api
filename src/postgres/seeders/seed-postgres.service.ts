import { faker } from '@faker-js/faker/locale/ar';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../../article/entities/article.entity';
import { ArticleCategoryEntity } from '../../article-category/entities/article-category.entity';
import { AuthorContactInfoEntity } from '../../author/entities/author-contact-info.entity';
import { AuthorEntity } from '../../author/entities/author.entity';
import { PublisherEntity } from '../../publisher/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { articleCategories } from './data/article-categories';
import { articles } from './data/articles';
import { authors } from './data/authors';
import { publishers } from './data/publishers';
import { users } from './data/users';

@Injectable()
export class SeedPostgresService {
  constructor (
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(PublisherEntity) private readonly publisherEntityRepository: Repository<PublisherEntity>,
    @InjectRepository(AuthorEntity) private readonly authorEntityRepository: Repository<AuthorEntity>,
    @InjectRepository(ArticleEntity) private readonly articleEntityRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleCategoryEntity) private readonly articleCategoryEntityRepository: Repository<ArticleCategoryEntity>,
    @InjectRepository(AuthorContactInfoEntity) private readonly authorContactInfoEntityRepository: Repository<AuthorContactInfoEntity>,
  ) {}

  async refreshDB () {
    await this.clearTables();

    await this.seedUsers();
    await this.seedAuthorsWithRelations();
    await this.seedArticleCategories();
    await this.seedPublishersWithRelations();
    await this.seedArticlesWithRelations();
  }

  private async clearTables () {
    await this.articleEntityRepository.delete({});
    await this.publisherEntityRepository.delete({});
    await this.authorContactInfoEntityRepository.delete({});
    await this.authorEntityRepository.delete({});
    await this.articleCategoryEntityRepository.delete({});
    await this.userEntityRepository.delete({});
  }

  private async seedUsers () {
    await this.userEntityRepository.insert(users);
  }

  private async seedAuthorsWithRelations () {
    const createdAuthors = await this.authorEntityRepository.save(authors);

    for (const author of createdAuthors) {
      const contactInfo = {
        id: faker.string.uuid(),
        instagram: faker.internet.url(),
        facebook: faker.internet.url(),
        telegram: faker.internet.url(),
        author: author,
      };

      await this.authorContactInfoEntityRepository.save(contactInfo);
    }
  }

  private async seedPublishersWithRelations () {
    const publishersWithoutArticles = publishers.map((pub) => ({
      id: pub.id,
      authorId: pub.authorId,
    }));

    await this.publisherEntityRepository.insert(publishersWithoutArticles);
  }

  private async seedArticleCategories () {
    await this.articleCategoryEntityRepository.insert(articleCategories);
  }

  private async seedArticlesWithRelations () {
    const articlesWithoutRelations = articles.map((article) => ({
      ...article,
      publisherId: publishers[0].id,
    }));

    await this.articleEntityRepository.insert(articlesWithoutRelations);
  }
}
