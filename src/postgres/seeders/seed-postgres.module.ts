import { Module } from '@nestjs/common';

import { DatabasePostgresModule } from '../database-postgres.module';

import { SeedPostgresService } from './seed-postgres.service';


@Module({
  imports: [
    DatabasePostgresModule,
  ],
  providers: [
    SeedPostgresService,
  ],
})
export class SeedPostgresModule {}
