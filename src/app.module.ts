import { AppController } from './app.controller';
import { ArticlesModule } from './article/articles.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { DatabasePostgresModule } from './postgres/database-postgres.module';
import { PublisherModule } from './publishers/publisher.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Module } from '@nestjs/common';
import { SeedCommand } from './postgres/seeders/seed.command';
import { SeedPostgresModule } from './postgres/seeders/seed-postgres.module';

@Module({
  imports: [
    AuthModule,
    PublisherModule,
    ReviewsModule,
    FileModule,
    ArticlesModule,
    DatabasePostgresModule,
    SeedPostgresModule,
  ],
  providers: [SeedCommand],
  controllers: [AppController],
})
export class AppModule {}
