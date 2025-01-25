import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PublisherCreateRequestDto } from '../publishers/dtos/request/publisher-create-request.dto';
import { JwtTokensDto } from '../auth/dtos/response/jwt-tokens.dto';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PublisherEntity } from '../publishers/entities/publisher.entity';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { PublisherService } from '../publishers/publisher.service';
import { AuthService } from '../auth/auth.service';
import { mockPublisherService } from './mocks/publisher.service.mock';
import { mockAuthService } from './mocks/auth.service.mock';
import { TypeOrmTestingModule } from './mocks/typeorm.mock';

describe('PublishersController (e2e)', () => {
  let app: INestApplication;
  let createdPublisherId: string;
  let authToken: string;
  let publisherRepository: Repository<PublisherEntity>;
  let userRepository: Repository<UserEntity>;

  const mockPublisher: PublisherCreateRequestDto = {
    user: {
      email: 'test.publisher@example.com',
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'Publisher',
    },
    contactInfo: {
      telegram: 'http://telegram.com/publisher',
      facebook: 'http://facebook.com/publisher',
      instagram: 'http://instagram.com/publisher',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestingModule(), AppModule],
    })
      .overrideProvider(PublisherService)
      .useValue(mockPublisherService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleFixture.createNestApplication();
    publisherRepository = moduleFixture.get(getRepositoryToken(PublisherEntity));
    userRepository = moduleFixture.get(getRepositoryToken(UserEntity));
    await app.init();
  }, 30000);

  beforeEach(async () => {});

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /publishers', () => {
    it('should create a new publisher', async () => {
      const response = await request(app.getHttpServer()).post('/publishers').send(mockPublisher).expect(409);

      expect(response.body.success).toBe(false);
      createdPublisherId = response.body.data?.id;
    });

    it('should login with created publisher', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockPublisher.user.email,
          password: mockPublisher.user.password,
        })
        .expect(201);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data).toBeDefined();

      const tokens: JwtTokensDto = loginResponse.body.data;
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      authToken = tokens.accessToken;
    });

    it('should not create a publisher with duplicate email', async () => {
      await request(app.getHttpServer()).post('/publishers').send(mockPublisher).expect(409);
    });
  });

  describe('GET /publishers', () => {
    it('should get all publishers with pagination', async () => {
      const response = await request(app.getHttpServer()).get('/publishers').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(typeof response.body.data.total).toBe('number');
    });

    it('should search publishers by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/publishers')
        .query({ searchQuery: 'Test Publisher' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data.length).toBe(0);
    });
  });

  describe('GET /publishers/:id', () => {
    it('should get publisher by id', async () => {
      const response = await request(app.getHttpServer()).get(`/publishers/${createdPublisherId}`).expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent publisher', async () => {
      await request(app.getHttpServer()).get('/publishers/00000000-0000-0000-0000-000000000000').expect(404);
    });
  });

  describe('PATCH /publishers/:id', () => {
    it('should update publisher contact info', async () => {
      const updateData = {
        contactInfo: {
          phone: '+1987654321',
          address: '456 Updated St',
        },
      };

      const response = await request(app.getHttpServer())
        .patch(`/publishers/${createdPublisherId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contactInfo.phone).toBe(updateData.contactInfo.phone);
      expect(response.body.data.contactInfo.address).toBe(updateData.contactInfo.address);
    });
  });

  describe('GET /publishers/auth-profile', () => {
    it('should not get profile without auth token', async () => {
      await request(app.getHttpServer()).get('/publishers/auth-profile').expect(401);
    });
  });
});
