import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorContactInfoEntity } from './entities/author-contact-info.entity';
import { AuthorEntity } from './entities/author.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity, AuthorContactInfoEntity]),
    UserModule,
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
