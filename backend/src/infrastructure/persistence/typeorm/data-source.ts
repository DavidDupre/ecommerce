// src/infrastructure/persistence/typeorm/data-source.ts
import { DataSource } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { TransactionOrmEntity } from './transaction.orm-entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  synchronize: true,
  logging: false,
  entities: [ProductOrmEntity, TransactionOrmEntity],
  migrations: [],
  subscribers: [],
});
