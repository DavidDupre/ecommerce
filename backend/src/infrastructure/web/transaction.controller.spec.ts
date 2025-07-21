// src/infrastructure/web/transaction.controller.spec.ts
import { Test } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { ProcessPaymentUseCase } from '../../core/use-cases/process-payment.use-case';
import { TransactionRepository } from '../../core/ports/transaction.repository.port';
import { left, right } from '../../../shared/either';
import { TransactionStatus } from '../../../core/entities/transaction.entity';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let mockProcessPaymentUseCase: jest.Mocked<ProcessPaymentUseCase>;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    mockProcessPaymentUseCase = {
      execute: jest.fn(),
    } as any;

    mockTransactionRepository = {
      findByTrackingNumber: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      findById: jest.fn(),
      generateTrackingNumber: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: ProcessPaymentUseCase,
          useValue: mockProcessPaymentUseCase,
        },
        {
          provide: 'TransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    transactionController = moduleRef.get<TransactionController>(
      TransactionController,
    );
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockPayload = {
        products: [{ productId: '1', quantity: 2 }],
        creditCardToken: 'token123',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        region: 'Bogota',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
      };

      const mockResult = {
        transactionId: 'txn-123',
        status: TransactionStatus.APPROVED,
        trackingNumber: 'WM123456',
        totalAmount: 210,
      };

      mockProcessPaymentUseCase.execute.mockResolvedValue(right(mockResult));

      const result = await transactionController.createTransaction(mockPayload);

      expect(result).toEqual({
        success: true,
        ...mockResult,
        estimatedDelivery: {
          minDays: 5,
          maxDays: 15,
          message: 'Entrega estimada: 5 a 15 días hábiles',
        },
      });
    });

    it('should handle payment failure', async () => {
      const mockPayload = {
        products: [{ productId: '1', quantity: 2 }],
        creditCardToken: 'token123',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        region: 'Bogota',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
      };

      mockProcessPaymentUseCase.execute.mockResolvedValue(
        left('PAYMENT_FAILED'),
      );

      const result = await transactionController.createTransaction(mockPayload);

      expect(result).toEqual({
        success: false,
        error: 'PAYMENT_FAILED',
      });
    });

    it('should validate products format', async () => {
      const result = await transactionController.createTransaction({
        products: 'invalid' as any,
      } as any);

      expect(result).toEqual({
        success: false,
        error: 'PRODUCTS_INVALID_FORMAT',
      });
    });
  });

  describe('getTransactionByTrackingNumber', () => {
    it('should return transaction details', async () => {
      const mockTransaction = {
        id: 'txn-123',
        products: [
          { productId: '1', quantity: 2, price: 100, name: 'Product 1' },
        ],
        totalAmount: 210,
        status: TransactionStatus.APPROVED,
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        postalCode: '110111',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
        shippingCost: 10,
        trackingNumber: 'WM123456',
      };

      mockTransactionRepository.findByTrackingNumber.mockResolvedValue(
        mockTransaction,
      );

      const result =
        await transactionController.getTransactionByTrackingNumber('WM123456');

      expect(result).toEqual({
        success: true,
        data: {
          status: mockTransaction.status,
          products: mockTransaction.products,
          customerName: mockTransaction.customerName,
          deliveryAddress: mockTransaction.deliveryAddress,
          city: mockTransaction.city,
          postalCode: mockTransaction.postalCode,
          totalAmount: mockTransaction.totalAmount,
          createdAt: mockTransaction.createdAt,
          updatedAt: mockTransaction.updatedAt,
          estimatedDelivery: {
            minDays: 5,
            maxDays: 15,
            message: 'Entrega estimada: 5 a 15 días hábiles',
          },
        },
      });
    });

    it('should handle transaction not found', async () => {
      mockTransactionRepository.findByTrackingNumber.mockResolvedValue(null);

      const result =
        await transactionController.getTransactionByTrackingNumber('INVALID');

      expect(result).toEqual({
        success: false,
        message: 'Transacción no encontrada',
      });
    });
  });
});
