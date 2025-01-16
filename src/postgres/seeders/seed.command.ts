import { Command, CommandRunner } from 'nest-commander';
import { SeedPostgresService } from './seed-postgres.service';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
  options: { isDefault: true }
})
export class SeedCommand extends CommandRunner {
  constructor(private readonly seedService: SeedPostgresService) {
    super();
  }

  async run(): Promise<void> {
    await this.seedService.refreshDB();
  }
}
