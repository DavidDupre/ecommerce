// src/infrastructure/persistence/typeorm/transaction.repository.spec.ts
import { Test } from '@nestjs/testing';
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
  let mockOrmRepository: jest.Mocked<Repository<TransactionOrmEntity>>;

  beforeEach(async () => {
    mockOrmRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmTransactionRepository,
        {
          provide: getRepositoryToken(TransactionOrmEntity),
          useValue: mockOrmRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<TypeOrmTransactionRepository>(
      TypeOrmTransactionRepository,
    );
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transaction = new Transaction(
        'txn-123',
        [{ productId: '1', quantity: 2, price: 100, name: 'Product 1' }],
        210,
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

      expect(mockOrmRepository.save).toHaveBeenCalledWith({
        id: 'txn-123',
        products: [
          { productId: '1', quantity: 2, price: 100, name: 'Product 1' },
        ],
        totalAmount: 210,
        status: 'PENDING',
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
      await repository.updateStatus('txn-123', TransactionStatus.APPROVED);

      expect(mockOrmRepository.update).toHaveBeenCalledWith(
        { id: 'txn-123' },
        { status: 'APPROVED' },
      );
    });
  });

  describe('findById', () => {
    it('should find a transaction by id', async () => {
      const mockTransaction = {
        id: 'txn-123',
        products: [
          { productId: '1', quantity: 2, price: 100, name: 'Product 1' },
        ],
        totalAmount: 210,
        status: 'APPROVED',
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

      mockOrmRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await repository.findById('txn-123');

      expect(result).toEqual(
        new Transaction(
          'txn-123',
          [{ productId: '1', quantity: 2, price: 100, name: 'Product 1' }],
          210,
          'APPROVED',
          'test@example.com',
          'Test User',
          '123 Street',
          'Bogota',
          '110111',
          '1234567890',
          mockTransaction.createdAt,
          mockTransaction.updatedAt,
          10,
          'WM123456',
        ),
      );
    });

    it('should return null when transaction not found', async () => {
      mockOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('txn-999');

      expect(result).toBeNull();
    });
  });

  describe('generateTrackingNumber', () => {
    it('should generate a tracking number', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // Mock random number

      const trackingNumber = await repository.generateTrackingNumber();

      expect(trackingNumber).toMatch(/^WM\d{12}$/);
    });
  });
});
