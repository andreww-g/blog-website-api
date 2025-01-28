import { PublisherEntity } from '../../publishers/entities/publisher.entity';

export const mockPublisherService = {
  create: jest.fn().mockImplementation((data) => {
    const publisher = new PublisherEntity();
    Object.assign(publisher, {
      id: 'mock-publisher-id',
      user: {
        id: 'mock-user-id',
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      },
      contactInfo: data.contactInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return Promise.resolve(publisher);
  }),

  findOneById: jest.fn().mockImplementation((id) => {
    const publisher = new PublisherEntity();
    Object.assign(publisher, {
      id,
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      contactInfo: {
        telegram: 'http://telegram.com/publisher',
        facebook: 'http://facebook.com/publisher',
        instagram: 'http://instagram.com/publisher',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return Promise.resolve(publisher);
  }),

  findAll: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: [],
      total: 0,
    });
  }),

  update: jest.fn().mockImplementation((id, data) => {
    const publisher = new PublisherEntity();
    Object.assign(publisher, {
      id,
      ...data,
      updatedAt: new Date(),
    });
    return Promise.resolve(publisher);
  }),
}; 