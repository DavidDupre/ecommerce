// src/infrastructure/web/product.controller.spec.ts
import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductRepository } from '../../../core/ports/product.repository.port';
import { Product } from '../../../core/entities/product.entity';

describe('ProductController', () => {
  let productController: ProductController;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: 'ProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productController = moduleRef.get<ProductController>(ProductController);
  });

  describe('getProducts', () => {
    it('should return products with filters', async () => {
      const mockProducts: Product[] = [
        new Product('1', 'Product 1', 'Desc 1', 100, 10, 'category1'),
        new Product('2', 'Product 2', 'Desc 2', 200, 20, 'category2'),
      ];

      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await productController.getProducts('100', '200');

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        minPrice: 100,
        maxPrice: 200,
      });
    });

    it('should return products without filters when none provided', async () => {
      const mockProducts: Product[] = [
        new Product('1', 'Product 1', 'Desc 1', 100, 10, 'category1'),
      ];

      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await productController.getProducts();

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products filtered by category', async () => {
      const mockProducts: Product[] = [
        new Product('1', 'Product 1', 'Desc 1', 100, 10, 'category1'),
      ];

      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await productController.getProductsByCategory('category1');

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        category: 'category1',
      });
    });
  });

  describe('obtenerProducto', () => {
    it('should return a product by id', async () => {
      const mockProduct = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await productController.obtenerProducto('1');

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      const result = await productController.obtenerProducto('999');

      expect(result).toBeNull();
    });
  });
});
