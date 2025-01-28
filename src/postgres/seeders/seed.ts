import { CommandFactory } from 'nest-commander';
import { SeedPostgresModule } from './seed-postgres.module';

async function bootstrap() {
  try {
    await CommandFactory.run(SeedPostgresModule, ['warn', 'error']);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

bootstrap();
