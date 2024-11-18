import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AuthorService } from '../author/author.service';
import { DEFAULT_TAKE } from '../common/utils/default-take';

import { PublisherEntity } from './entities/publisher.entity';

@Injectable()
export class PublisherService {
  constructor (
    @InjectRepository(PublisherEntity)
    private readonly publisherRepository: Repository<PublisherEntity>,
    private readonly authorService: AuthorService,
  ) {}

  async create (authorId: string, articleIds: string[]) {
    const author = await this.authorService.findOneById(authorId);

    const publisher = this.publisherRepository.create({
      author,
      articles: articleIds.map((id) => ({ id })),
    });

    return this.publisherRepository.save(publisher);
  }

  async findOneById (id: string): Promise<PublisherEntity> {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
      relations: ['author', 'articles'],
    });

    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} not found`);
    }

    return publisher;
  }

  async findAll (
    options: {
      skip?: number,
      take?: number,
      searchQuery?: string,
    } = {},
  ) {
    const { skip, take, searchQuery } = options;

    const queryBuilder = this.publisherRepository
      .createQueryBuilder('publisher')
      .leftJoinAndSelect('publisher.author', 'author')
      .leftJoinAndSelect('author.user', 'user')
      .leftJoinAndSelect('publisher.articles', 'articles');

    if (searchQuery) {
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
    queryBuilder.skip(take || DEFAULT_TAKE);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }
}
