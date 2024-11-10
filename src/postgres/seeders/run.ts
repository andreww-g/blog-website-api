import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';


import { SeedPostgresModule } from './seed-postgres.module';
import { SeedPostgresService } from './seed-postgres.service';


async function bootstrap () {
  NestFactory.createApplicationContext(SeedPostgresModule)
    .then((appContext) => {
      const seeder = appContext.get(SeedPostgresService);

      seeder
        .refreshDB()
        .then(() => {
          Logger.debug('Seeding complete!');
        })
        .catch((error) => {
          Logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
