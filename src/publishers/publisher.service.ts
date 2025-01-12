import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DEFAULT_TAKE } from '../common/utils/default-take';

import { PublisherEntity } from './entities/publisher.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(PublisherEntity)
    private readonly publisherRepository: Repository<PublisherEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, articleIds: string[]) {
    const user = await this.userService.findOneById(userId);

    const publisher = this.publisherRepository.create({
      user,
      articles: articleIds.map((id) => ({ id })),
    });

    return this.publisherRepository.save(publisher);
  }

  async findOneById(id: string): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
      relations: ['user', 'articles', 'contactInfo'],
    });

    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} not found`);
    }

    return publisher;
  }

  async findAll(
    options: {
      skip?: number;
      take?: number;
      searchQuery?: string;
    } = {},
  ) {
    const { skip, take, searchQuery } = options;

    const queryBuilder = this.publisherRepository
      .createQueryBuilder('publisher')
      .leftJoinAndSelect('publisher.user', 'user')
      .leftJoinAndSelect('publisher.articles', 'articles');

    if (searchQuery && searchQuery !== 'null') {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('user.firstName ILIKE :searchQuery', {
            searchQuery: `%${searchQuery}%`,
          })
            .orWhere('user.lastName ILIKE :searchQuery', {
              searchQuery: `%${searchQuery}%`,
            })
            .orWhere('user.email ILIKE :searchQuery', {
              searchQuery: `%${searchQuery}%`,
            });

          const searchElements = searchQuery.split(' ');

          if (searchElements.length > 1) {
            qb.where('user.firstName ILIKE :element', {
              element: `%${searchElements[0]}%`,
            }).andWhere('user.lastName ILIKE :element', {
              element: `%${searchElements[1]}%`,
            });
          }
        }),
      );
    }

    if (skip) queryBuilder.skip(skip);
    queryBuilder.take(take || DEFAULT_TAKE);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }
}
