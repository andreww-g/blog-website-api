import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserCreateRequestDto } from './dtos/request/user-create-request.dto';
import { UserUpdateRequestDto } from './dtos/request/user-update-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: UserCreateRequestDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, data: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = await this.findOneById(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.userRepository.update(id, data);
    return this.findOneById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }
}
