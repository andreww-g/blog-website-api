import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateArticleDto } from '../article/dtos/request/create-article.dto';
import { AppModule } from '../app.module';
import { ArticlesService } from '../article/articles.service';
import { PublisherService } from '../publishers/publisher.service';
import { AuthService } from '../auth/auth.service';
import { mockArticleService } from './mocks/article.service.mock';
import { mockPublisherService } from './mocks/publisher.service.mock';
import { mockAuthService } from './mocks/auth.service.mock';
import { TypeOrmTestingModule } from './mocks/typeorm.mock';

describe('ArticlesController (e2e)', () => {
  let app: INestApplication;
  let createdArticleId: string;
  let publisherId: string;
  let authToken: string;

  const mockPublisher = {
    user: {
      email: 'article.test2@example.com',
      password: 'Test123!@#',
      firstName: 'Article',
      lastName: 'Tester',
    },
    contactInfo: {
      telegram: 'http://telegram.com/publisher',
      facebook: 'http://facebook.com/publisher',
      instagram: 'http://instagram.com/publisher',
    },
  };

  const mockArticle: CreateArticleDto = {
    title: 'Test Article',
    description: 'This is a test article description',
    slug: 'test-article',
    content: { blocks: [] },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestingModule(), AppModule],
    })
      .overrideProvider(ArticlesService)
      .useValue(mockArticleService)
      .overrideProvider(PublisherService)
      .useValue(mockPublisherService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const response = await request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockArticle, publisherId })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe(mockArticle.title);
      console.log(response);
      createdArticleId = response.body.data.id;
    });

    it('should not create an article without authentication', async () => {
      await request(app.getHttpServer()).post('/articles').send(mockArticle).expect(401);
    });
  });

  describe('GET /articles', () => {
    it('should get all articles with pagination', async () => {
      const response = await request(app.getHttpServer()).get('/articles').query({ onlyPublished: false }).expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(typeof response.body.data.total).toBe('number');
    });
  });

  describe('GET /articles/:id', () => {
    it('should get article by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/articles/${createdArticleId}`)
        .query({ onlyPublished: false })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdArticleId);
    });

    it('should return 404 for non-existent article', async () => {
      await request(app.getHttpServer())
        .get('/articles/00000000-0000-0000-0000-000000000000')
        .query({ onlyPublished: false })
        .expect(404);
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should update article', async () => {
      const updateData = {
        title: 'Updated Test Article',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/articles/${createdArticleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });
  });

  describe('POST /articles/:id/publish', () => {
    it('should publish an article', async () => {
      const response = await request(app.getHttpServer())
        .post(`/articles/${createdArticleId}/publish`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.publishedAt).toBeTruthy();
    });
  });

  describe('POST /articles/:id/unpublish', () => {
    it('should unpublish an article', async () => {
      const response = await request(app.getHttpServer())
        .post(`/articles/${createdArticleId}/unpublish`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.publishedAt).toBeNull();
    });
  });
});
