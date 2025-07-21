import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTransactionRepository } from './transaction.repository';
import { TransactionOrmEntity } from './transaction.orm-entity';
import {
  Transaction,
  TransactionStatus,
} from '../../../core/entities/transaction.entity';

describe('TypeOrmTransactionRepository', () => {
  let repository: TypeOrmTransactionRepository;
  let ormRepository: Repository<TransactionOrmEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmTransactionRepository,
        {
          provide: getRepositoryToken(TransactionOrmEntity),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeOrmTransactionRepository>(
      TypeOrmTransactionRepository,
    );
    ormRepository = module.get<Repository<TransactionOrmEntity>>(
      getRepositoryToken(TransactionOrmEntity),
    );
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transaction = new Transaction(
        'txn_123',
        [{ productId: 'prod_1', quantity: 2, price: 50, name: 'Product 1' }],
        100,
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

      await repository.create(transaction);

      expect(ormRepository.save).toHaveBeenCalledWith({
        id: 'txn_123',
        products: [
          { productId: 'prod_1', quantity: 2, price: 50, name: 'Product 1' },
        ],
        totalAmount: 100,
        status: TransactionStatus.PENDING,
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
        trackingNumber: 'WM123456',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', async () => {
      await repository.updateStatus('txn_123', TransactionStatus.APPROVED);
      expect(ormRepository.update).toHaveBeenCalledWith(
        { id: 'txn_123' },
        { status: TransactionStatus.APPROVED },
      );
    });
  });

  describe('findById', () => {
    it('should find transaction by id', async () => {
      const mockOrmEntity = {
        id: 'txn_123',
        products: [
          { productId: 'prod_1', quantity: 2, price: 50, name: 'Product 1' },
        ],
        totalAmount: 100,
        status: TransactionStatus.PENDING,
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
        trackingNumber: 'WM123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (ormRepository.findOne as jest.Mock).mockResolvedValue(mockOrmEntity);

      const result = await repository.findById('txn_123');

      expect(result).toEqual(
        new Transaction(
          'txn_123',
          [{ productId: 'prod_1', quantity: 2, price: 50, name: 'Product 1' }],
          100,
          TransactionStatus.PENDING,
          'test@example.com',
          'Test User',
          '123 Street',
          'Bogota',
          '110111',
          '1234567890',
          mockOrmEntity.createdAt,
          mockOrmEntity.updatedAt,
          10,
          'WM123456',
        ),
      );
    });

    it('should return null if transaction not found', async () => {
      (ormRepository.findOne as jest.Mock).mockResolvedValue(null);
      const result = await repository.findById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('findByTrackingNumber', () => {
    it('should find transaction by tracking number', async () => {
      const mockOrmEntity = {
        id: 'txn_123',
        products: [
          { productId: 'prod_1', quantity: 2, price: 50, name: 'Product 1' },
        ],
        totalAmount: 100,
        status: TransactionStatus.PENDING,
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
        trackingNumber: 'WM123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (ormRepository.findOne as jest.Mock).mockResolvedValue(mockOrmEntity);

      const result = await repository.findByTrackingNumber('WM123456');

      expect(result).toEqual(
        new Transaction(
          'txn_123',
          [{ productId: 'prod_1', quantity: 2, price: 50, name: 'Product 1' }],
          100,
          TransactionStatus.PENDING,
          'test@example.com',
          'Test User',
          '123 Street',
          'Bogota',
          '110111',
          '1234567890',
          mockOrmEntity.createdAt,
          mockOrmEntity.updatedAt,
          10,
          'WM123456',
        ),
      );
    });
  });

  describe('generateTrackingNumber', () => {
    it('should generate a tracking number', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1234567890123);

      const result = await repository.generateTrackingNumber();
      expect(result).toMatch(/^WM\d{12}$/);
    });
  });
});
