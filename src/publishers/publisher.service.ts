import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { DEFAULT_TAKE } from '../common/utils/default-take';

import { PublisherEntity } from './entities/publisher.entity';
import { UserService } from '../user/user.service';
import { merge } from 'lodash';

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

  async update(id: string, data: DeepPartial<PublisherEntity>): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository
      .createQueryBuilder('publisher')
      .leftJoinAndSelect('publisher.user', 'user')
      .leftJoinAndSelect('publisher.contactInfo', 'contactInfo')
      .where('publisher.id = :id', { id })
      .getOne();

    console.log('Update Data:', data);

    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} not found`);
    }

    if (data.user) {
      await this.userService.update(publisher.user.id, data.user);
    }

    // Update contact info if provided
    if (data.contactInfo) {
      if (!publisher.contactInfo) {
        publisher.contactInfo = this.publisherRepository.create().contactInfo;
      }
      const mergedPublisher = merge({}, publisher, { contactInfo: data.contactInfo });
      await this.publisherRepository.save(mergedPublisher);
    }

    return this.findOneById(id);
  }

  async findOneByUserId(userId: string): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository
      .createQueryBuilder('publisher')
      .leftJoinAndSelect('publisher.avatar', 'avatar')
      .leftJoinAndSelect('publisher.contactInfo', 'contactInfo')
      .leftJoinAndSelect('publisher.user', 'user')
      .leftJoinAndSelect('publisher.articles', 'articles')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!publisher) {
      throw new NotFoundException(`Publisher with user id ${userId} not found`);
    }

    return publisher;
  }

  async findOneById(id: string): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository
      .createQueryBuilder('publisher')
      .leftJoinAndSelect('publisher.avatar', 'avatar')
      .leftJoinAndSelect('publisher.contactInfo', 'contactInfo')
      .leftJoinAndSelect('publisher.user', 'user')
      .leftJoinAndSelect('publisher.articles', 'articles')
      .where('publisher.id = :id', { id })
      .getOne();

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
      .leftJoinAndSelect('publisher.avatar', 'avatar')
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
