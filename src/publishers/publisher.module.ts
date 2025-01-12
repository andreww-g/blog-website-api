import { TypeOrmModule } from '@nestjs/typeorm';

import { PublisherEntity } from './entities/publisher.entity';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { PublisherContactInfoEntity } from './entities/publisher-contact-info.entity';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PublisherEntity, PublisherContactInfoEntity]), UserModule],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}
