import { PublisherService } from '../publishers/publisher.service';
import { setupTestApp } from './setup/test-setup';
import { DeepPartial } from 'typeorm';
import { PublisherEntity } from '../publishers/entities/publisher.entity';
import { AuthService } from '../auth/auth.service';

describe('PublishersController (e2e)', () => {
  let publisherService: PublisherService;
  let authService: AuthService;
  let createdPublisherId: string;
  let authToken: string;

  const mockPublisher: DeepPartial<PublisherEntity> = {
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

  beforeEach(async () => {
    const testSetup = await setupTestApp();
    publisherService = testSetup.publisherService;
    authService = testSetup.authService;
  });

  describe('Publishers', () => {
    it('should create a new publisher', async () => {
      const result = await publisherService.create(mockPublisher);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      createdPublisherId = result.id;
    });

    it('should login with created publisher', async () => {
      const result = await authService.loginUser({
        email: mockPublisher.user.email,
        password: mockPublisher.user.password,
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      authToken = result.accessToken;
    });

    it('should get all publishers with pagination', async () => {
      const result = await publisherService.findAll({});

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.total).toBe('number');
    });

    it('should get publisher by id', async () => {
      const result = await publisherService.findOneById(createdPublisherId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdPublisherId);
    });

    it('should update publisher contact info', async () => {
      const updateData = {
        contactInfo: {
          facebook: 'http://facebook.com/123',
          instagram: 'http://instagram.com/123',
        },
      };

      const result = await publisherService.update(createdPublisherId, updateData);

      expect(result).toBeDefined();
      expect(result.contactInfo.facebook).toBe(updateData.contactInfo.facebook);
      expect(result.contactInfo.instagram).toBe(updateData.contactInfo.instagram);
    });
  });
});
