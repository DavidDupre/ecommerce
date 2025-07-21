// src/infrastructure/persistence/typeorm/product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProductFilters,
  ProductRepository,
} from '../../../core/ports/product.repository.port';
import { ProductOrmEntity } from './product.orm-entity';
import { Product } from '@core/entities/product.entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(filters: ProductFilters = {}): Promise<Product[]> {
    const query = this.repository.createQueryBuilder('product');

    if (filters.category) {
      query.andWhere('product.category = :category', {
        category: filters.category,
      });
    }
    if (filters.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    const products = await query.getMany();
    return products.map(this.toDomainEntity);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findOne({
      where: { id },
    });
    return product ? this.toDomainEntity(product) : null;
  }

  async save(product: Product): Promise<void> {
    const ormEntity = this.toOrmEntity(product);
    await this.repository.save(ormEntity);
  }

  private toDomainEntity(ormEntity: ProductOrmEntity): Product {
    return new Product(
      ormEntity.id,
      ormEntity.name,
      ormEntity.description,
      ormEntity.price,
      ormEntity.stock,
      ormEntity.category,
    );
  }

  private toOrmEntity(domainEntity: Product): ProductOrmEntity {
    const ormEntity = new ProductOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.description = domainEntity.description;
    ormEntity.price = domainEntity.price;
    ormEntity.stock = domainEntity.stock;
    ormEntity.category = domainEntity.category;
    return ormEntity;
  }
}
