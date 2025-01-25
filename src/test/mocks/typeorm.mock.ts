import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../../article/entities/article.entity';
import { PublisherEntity } from '../../publishers/entities/publisher.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { DynamicModule } from '@nestjs/common';

const createMockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
  create: jest.fn().mockImplementation((entity) => ({ id: 'mock-id', ...entity })),
  delete: jest.fn().mockResolvedValue(true),
  query: jest.fn().mockResolvedValue([]),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(null),
    getMany: jest.fn().mockResolvedValue([]),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
});

export const mockRepositories = [
  {
    provide: getRepositoryToken(ArticleEntity),
    useFactory: createMockRepository,
  },
  {
    provide: getRepositoryToken(PublisherEntity),
    useFactory: createMockRepository,
  },
  {
    provide: getRepositoryToken(UserEntity),
    useFactory: createMockRepository,
  },
];

export const TypeOrmTestingModule = (): DynamicModule => ({
  module: class TypeOrmTestingModule {},
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: false,
      synchronize: false,
      entities: [],
    }),
    TypeOrmModule.forFeature([ArticleEntity, PublisherEntity, UserEntity]),
  ],
  providers: [...mockRepositories],
  exports: [TypeOrmModule],
});
