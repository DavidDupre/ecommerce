// src/core/entities/product.entity.spec.ts
import { Product } from './product.entity';

describe('Product', () => {
  it('should create a product', () => {
    const product = new Product(
      '1',
      'Product 1',
      'Desc 1',
      100,
      10,
      'category1',
    );

    expect(product.id).toBe('1');
    expect(product.name).toBe('Product 1');
    expect(product.stock).toBe(10);
  });

  describe('reduceStock', () => {
    it('should reduce stock when enough available', () => {
      const product = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );
      product.reduceStock(5);
      expect(product.stock).toBe(5);
    });

    it('should throw error when insufficient stock', () => {
      const product = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );
      expect(() => product.reduceStock(15)).toThrow('Insufficient stock');
    });
  });
});

// src/core/entities/transaction.entity.spec.ts
import { Transaction, TransactionStatus } from './transaction.entity';

describe('Transaction', () => {
  it('should create a transaction with default values', () => {
    const transaction = new Transaction(
      'txn-123',
      [{ productId: '1', quantity: 2, price: 100, name: 'Product 1' }],
      200,
      TransactionStatus.PENDING,
      'test@example.com',
      'Test User',
      '123 Street',
      'Bogota',
      '110111',
      '1234567890',
      new Date(),
      new Date(),
      10,
      'WM123456',
    );

    expect(transaction.id).toBe('txn-123');
    expect(transaction.status).toBe(TransactionStatus.PENDING);
    expect(transaction.estimatedDeliveryDays).toEqual({ min: 5, max: 15 });
  });
});
