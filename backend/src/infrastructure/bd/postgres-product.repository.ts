import {
  ProductRepository,
  ProductFilters,
} from '../../core/ports/product.repository.port';
import { Product } from '../../core/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostgresProductRepository implements ProductRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    let query = 'SELECT * FROM products';
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters?.category) {
      values.push(filters.category);
      conditions.push(`category = $${values.length}`);
    }
    if (filters?.minPrice !== undefined) {
      values.push(filters.minPrice);
      conditions.push(`price >= $${values.length}`);
    }
    if (filters?.maxPrice !== undefined) {
      values.push(filters.maxPrice);
      conditions.push(`price <= $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async save(product: Product): Promise<void> {
    await this.pool.query(
      'INSERT INTO products (id, name, description, price, stock, category, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())',
      [
        product.id,
        product.name,
        product.description,
        product.price,
        product.stock,
        product.category,
      ],
    );
  }
}
