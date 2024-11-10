import 'reflect-metadata';

import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';

import { ConfigService } from '../config/config.service';

import { SnakeNamingStrategy } from './strategies/snake-naming.strategy';


const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  ...configService.typeormConfig,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  type: 'postgres',
  entities: [
    join(__dirname, '..', '**', '*.entity.{ts,js}'),
  ],
  migrations: [
    join(__dirname, 'migrations', '*.{ts,js}'),
  ],
};
export const dataSource = new DataSource(dataSourceOptions);
