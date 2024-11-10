import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { SnakeNamingStrategy } from './strategies/snake-naming.strategy';


const typeormModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    ...configService.typeormConfig,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    type: 'postgres',
    autoLoadEntities: true,
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    typeormModule,
  ],
  exports: [
    typeormModule,
  ],
})
export class DatabasePostgresModule {}
