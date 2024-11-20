import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SeedPostgresModule } from './seed-postgres.module';
import { SeedPostgresService } from './seed-postgres.service';


async function bootstrap () {
  const logger = new Logger('Seeder');

  logger.log('Starting seeding...');

  try {
    const appContext = await NestFactory.createApplicationContext(SeedPostgresModule);
    const seeder = appContext.get(SeedPostgresService);

    await seeder.refreshDB();
    logger.log('Seeding completed successfully');

    await appContext.close();
  } catch (error) {
    logger.error('Seeding failed!');
    logger.error(error);
    throw error;
  }
}

bootstrap();
