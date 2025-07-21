import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmProductRepository } from './product.repository';
import { ProductOrmEntity } from './product.orm-entity';
import { Product } from '../../../core/entities/product.entity';

describe('TypeOrmProductRepository', () => {
  let repository: TypeOrmProductRepository;
  let ormRepository: Repository<ProductOrmEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmProductRepository,
        {
          provide: getRepositoryToken(ProductOrmEntity),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeOrmProductRepository>(TypeOrmProductRepository);
    ormRepository = module.get<Repository<ProductOrmEntity>>(
      getRepositoryToken(ProductOrmEntity),
    );
  });

  describe('findAll', () => {
    it('should find all products without filters', async () => {
      const mockProducts = [
        {
          id: 'prod_1',
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 10,
          category: 'Category 1',
        },
      ];

      (
        ormRepository.createQueryBuilder().getMany as jest.Mock
      ).mockResolvedValue(mockProducts);

      const result = await repository.findAll();

      expect(result).toEqual([
        new Product(
          'prod_1',
          'Product 1',
          'Description 1',
          100,
          10,
          'Category 1',
        ),
      ]);
    });

    it('should apply category filter', async () => {
      const mockProducts = [
        {
          id: 'prod_1',
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 10,
          category: 'Category 1',
        },
      ];

      (
        ormRepository.createQueryBuilder().getMany as jest.Mock
      ).mockResolvedValue(mockProducts);

      await repository.findAll({ category: 'Category 1' });

      expect(ormRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'product.category = :category',
        { category: 'Category 1' },
      );
    });

    it('should apply price filters', async () => {
      await repository.findAll({ minPrice: 50, maxPrice: 200 });

      expect(ormRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'product.price >= :minPrice',
        { minPrice: 50 },
      );
      expect(ormRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'product.price <= :maxPrice',
        { maxPrice: 200 },
      );
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const mockProduct = {
        id: 'prod_1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        category: 'Category 1',
      };

      (ormRepository.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const result = await repository.findById('prod_1');

      expect(result).toEqual(
        new Product(
          'prod_1',
          'Product 1',
          'Description 1',
          100,
          10,
          'Category 1',
        ),
      );
    });

    it('should return null if product not found', async () => {
      (ormRepository.findOne as jest.Mock).mockResolvedValue(null);
      const result = await repository.findById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a product', async () => {
      const product = new Product(
        'prod_1',
        'Product 1',
        'Description 1',
        100,
        10,
        'Category 1',
      );

      await repository.save(product);

      expect(ormRepository.save).toHaveBeenCalledWith({
        id: 'prod_1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        category: 'Category 1',
      });
    });
  });
});
