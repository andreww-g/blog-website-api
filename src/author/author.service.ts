import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorDto } from './dtos/request/create-author.dto';
import { UpdateAuthorDto } from './dtos/request/update-author.dto';
import { UserService } from '../user/user.service';
import { ContactInfoEntity } from './entities/contact-info.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    @InjectRepository(ContactInfoEntity)
    private readonly contactInfoRepository: Repository<ContactInfoEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorEntity> {
    const user = await this.userService.findByUserId(createAuthorDto.userId);

    const existingAuthor = await this.authorRepository.findOne({
      where: { user: { userId: createAuthorDto.userId } },
      relations: ['user'],
    });

    if (existingAuthor) {
      throw new ConflictException('Author already exists for this user');
    }

    const author = this.authorRepository.create({
      user,
      contactInfo: createAuthorDto.contactInfo
        ? { ...createAuthorDto.contactInfo }
        : null,
    });

    return this.authorRepository.save(author);
  }

  async findAll(): Promise<AuthorEntity[]> {
    return this.authorRepository.find({
      relations: ['user', 'contactInfo'],
    });
  }

  async findOneById(id: string): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['user', 'contactInfo'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async update(id: number, data: UpdateAuthorDto): Promise<AuthorEntity> {
    const author = await this.findOneById(id);

    if (data.contactInfo) {
      if (!author.contactInfo) {
        author.contactInfo = this.contactInfoRepository.create(
          data.contactInfo,
        );
      } else {
        Object.assign(author.contactInfo, data.contactInfo);
      }
    }

    await this.contactInfoRepository.save(author.contactInfo);

    return this.authorRepository.save(author);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.authorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return true;
  }
}
