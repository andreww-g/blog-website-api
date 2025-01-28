import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from '../../article/articles.service';
import { PublisherService } from '../../publishers/publisher.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleEntity } from '../../article/entities/article.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PublisherController } from '../../publishers/publisher.controller';
import { ArticlesController } from '../../article/articles.controller';
import { AuthController } from '../../auth/auth.controller';

export const setupTestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    controllers: [PublisherController, ArticlesController, AuthController],
    providers: [
      {
        provide: ArticlesService,
        useValue: {
          createArticle: jest.fn().mockImplementation((data, publisherId) => ({
            id: 'mock-article-id',
            ...data,
            publisherId,
            publishedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          findOneById: jest.fn().mockImplementation((id) => ({
            id,
            title: 'Test Article',
            description: 'Test Description',
            publishedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          getArticles: jest.fn().mockResolvedValue({
            data: [],
            total: 0,
          }),
          updateArticle: jest.fn().mockImplementation((id, data) => ({
            id,
            ...data,
            publishedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          publishArticle: jest.fn().mockImplementation((id) => ({
            id,
            title: 'Test Article',
            description: 'Test Description',
            publishedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          unpublishArticle: jest.fn().mockImplementation((id) => ({
            id,
            title: 'Test Article',
            description: 'Test Description',
            publishedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          deleteArticle: jest.fn().mockResolvedValue(true),
        },
      },
      {
        provide: PublisherService,
        useValue: {
          create: jest.fn().mockImplementation((data) => ({
            id: 'mock-publisher-id',
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          findOneById: jest.fn().mockImplementation((id) => ({
            id,
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
            },
            contactInfo: {
              telegram: 'http://telegram.com/publisher',
              facebook: 'http://facebook.com/publisher',
              instagram: 'http://instagram.com/publisher',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          findOneByUserId: jest.fn(),
          findAll: jest.fn().mockResolvedValue({
            data: [],
            total: 0,
          }),
          update: jest.fn().mockImplementation((id, data) => ({
            id,
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
            },
            contactInfo: {
              ...data.contactInfo,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
      },
      {
        provide: AuthService,
        useValue: {
          loginUser: jest.fn().mockResolvedValue({
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          }),
          refreshAccessToken: jest.fn(),
        },
      },
      {
        provide: UserService,
        useValue: {
          create: jest.fn().mockImplementation((data) => ({
            id: 'mock-user-id',
            ...data,
          })),
          findOneByEmail: jest.fn(),
          findOneById: jest.fn(),
          update: jest.fn(),
        },
      },
      {
        provide: getRepositoryToken(ArticleEntity),
        useValue: {
          find: jest.fn().mockResolvedValue([]),
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
          create: jest.fn().mockImplementation((entity) => ({ id: 'mock-id', ...entity })),
        },
      },
      {
        provide: getRepositoryToken(PublisherEntity),
        useValue: {
          find: jest.fn().mockResolvedValue([]),
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
          create: jest.fn().mockImplementation((entity) => ({ id: 'mock-id', ...entity })),
        },
      },
      {
        provide: getRepositoryToken(UserEntity),
        useValue: {
          find: jest.fn().mockResolvedValue([]),
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
          create: jest.fn().mockImplementation((entity) => ({ id: 'mock-id', ...entity })),
        },
      },
    ],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  await app.init();

  return {
    app,
    articleService: moduleFixture.get<ArticlesService>(ArticlesService),
    publisherService: moduleFixture.get<PublisherService>(PublisherService),
    authService: moduleFixture.get<AuthService>(AuthService),
  };
};
