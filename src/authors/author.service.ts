import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { IAuthUser } from '../common/interfaces/auth/auth-user.interface';

import { AuthorContactInfoEntity } from './entities/author-contact-info.entity';
import { AuthorEntity } from './entities/author.entity';


@Injectable()
export class AuthorService {
  constructor (
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    @InjectRepository(AuthorContactInfoEntity)
    private readonly contactInfoRepository: Repository<AuthorContactInfoEntity>,
  ) {}

  async create (data: DeepPartial<AuthorEntity>): Promise<AuthorEntity> {
    const user = await this.findOneById(data.id);

    const existingAuthor = await this.authorRepository.findOne({
      where: { id: user.id },
      relations: ['user'],
    });

    if (existingAuthor) {
      throw new ConflictException('Author already exists for this user');
    }

    const author = this.authorRepository.create({
      user,
      contactInfo: data.contactInfo ? { ...data.contactInfo } : null,
    });

    return this.authorRepository.save(author);
  }

  async findAll (): Promise<AuthorEntity[]> {
    return this.authorRepository.find({
      relations: ['user', 'contactInfo'],
    });
  }

  async findOneById (id: string): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['user', 'contactInfo'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async findProfile (user: IAuthUser): Promise<AuthorEntity> {
    console.log(user.authorId, user.role);
    const author = await this.authorRepository.findOne({
      where: { id: user.authorId },
      relations: ['user', 'contactInfo'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${author.userId} not found`);
    }

    return author;
  }

  async findOneByEmail (email: string): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne({
      where: { user: { email } },
      relations: ['user', 'contactInfo'],
    });

    if (!author) {
      throw new NotFoundException(`Author with email ${email} not found`);
    }

    return author;
  }

  async update (
    id: string,
    data: DeepPartial<AuthorEntity>,
  ): Promise<AuthorEntity> {
    const author = await this.findOneById(id);

    if (data.contactInfo) {
      if (author.contactInfo) {
        Object.assign(author.contactInfo, data.contactInfo);
      } else {
        author.contactInfo = this.contactInfoRepository.create(
          data.contactInfo,
        );
      }
    }

    await this.contactInfoRepository.save(author.contactInfo);

    return this.authorRepository.save(author);
  }

  async remove (id: string): Promise<boolean> {
    const result = await this.authorRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return true;
  }
}
