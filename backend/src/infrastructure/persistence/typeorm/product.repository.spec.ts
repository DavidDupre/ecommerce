// src/infrastructure/persistence/typeorm/product.repository.spec.ts
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmProductRepository } from './product.repository';
import { ProductOrmEntity } from './product.orm-entity';
import { Product } from '../../../core/entities/product.entity';

describe('TypeOrmProductRepository', () => {
  let repository: TypeOrmProductRepository;
  let mockOrmRepository: jest.Mocked<Repository<ProductOrmEntity>>;

  beforeEach(async () => {
    mockOrmRepository = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmProductRepository,
        {
          provide: getRepositoryToken(ProductOrmEntity),
          useValue: mockOrmRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<TypeOrmProductRepository>(
      TypeOrmProductRepository,
    );
  });

  describe('findAll', () => {
    it('should return products with filters', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          stock: 10,
          category: 'category1',
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProducts),
      };

      mockOrmRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await repository.findAll({
        category: 'category1',
        minPrice: 50,
        maxPrice: 150,
      });

      expect(result).toEqual([
        new Product('1', 'Product 1', 'Desc 1', 100, 10, 'category1'),
      ]);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });

    it('should return products without filters', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          stock: 10,
          category: 'category1',
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProducts),
      };

      mockOrmRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await repository.findAll();

      expect(result).toEqual([
        new Product('1', 'Product 1', 'Desc 1', 100, 10, 'category1'),
      ]);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        stock: 10,
        category: 'category1',
      };

      mockOrmRepository.findOne.mockResolvedValue(mockProduct);

      const result = await repository.findById('1');

      expect(result).toEqual(
        new Product('1', 'Product 1', 'Desc 1', 100, 10, 'category1'),
      );
    });

    it('should return null when product not found', async () => {
      mockOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a product', async () => {
      const product = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );

      await repository.save(product);

      expect(mockOrmRepository.save).toHaveBeenCalledWith({
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        stock: 10,
        category: 'category1',
      });
    });
  });
});
