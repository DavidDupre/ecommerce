import { Product } from '../entities/product.entity';

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export abstract class ProductRepository {
  abstract findAll(filters?: ProductFilters): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
  abstract save(product: Product): Promise<void>;
}
