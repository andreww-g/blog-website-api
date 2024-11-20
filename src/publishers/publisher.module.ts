import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorModule } from '../authors/author.module';

import { PublisherEntity } from './entities/publisher.entity';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([PublisherEntity]),
    AuthorModule,
  ],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}
