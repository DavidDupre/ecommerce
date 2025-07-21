// src/core/use-cases/process-payment.use-case.spec.ts
import { Test } from '@nestjs/testing';
import { ProcessPaymentUseCase } from './process-payment.use-case';
import { ProductRepository } from '../ports/product.repository.port';
import { TransactionRepository } from '../ports/transaction.repository.port';
import { PaymentService } from '../ports/payment.service.port';
import { TransactionStatus } from '../entities/transaction.entity';
import { Product } from '../entities/product.entity';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;
  let mockPaymentService: jest.Mocked<PaymentService>;

  beforeEach(async () => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    mockTransactionRepository = {
      create: jest.fn(),
      updateStatus: jest.fn(),
      findById: jest.fn(),
      findByTrackingNumber: jest.fn(),
      generateTrackingNumber: jest.fn().mockResolvedValue('WM123456'),
    };

    mockPaymentService = {
      processPayment: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: 'ProductRepository',
          useValue: mockProductRepository,
        },
        {
          provide: 'TransactionRepository',
          useValue: mockTransactionRepository,
        },
        {
          provide: 'PaymentService',
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    useCase = moduleRef.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
  });

  describe('execute', () => {
    const validCommand = {
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

    it('should process payment successfully', async () => {
      const mockProduct = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      mockPaymentService.processPayment.mockResolvedValue({
        success: true,
        status: 'APPROVED',
        transactionId: 'txn-123',
      });

      const result = await useCase.execute(validCommand);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual({
          transactionId: expect.any(String),
          status: TransactionStatus.APPROVED,
          trackingNumber: 'WM123456',
          totalAmount: 210, // (100 * 2) + 10 shipping
        });
      }

      expect(mockTransactionRepository.create).toHaveBeenCalled();
      expect(mockTransactionRepository.updateStatus).toHaveBeenCalledWith(
        expect.any(String),
        TransactionStatus.APPROVED,
      );
      expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it('should return PRODUCT_NOT_FOUND when product does not exist', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute(validCommand);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value).toBe('PRODUCT_NOT_FOUND');
      }
    });

    it('should return INSUFFICIENT_STOCK when not enough stock', async () => {
      const mockProduct = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        1,
        'category1',
      );
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await useCase.execute({
        ...validCommand,
        products: [{ productId: '1', quantity: 2 }],
      });

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value).toBe('INSUFFICIENT_STOCK');
      }
    });

    it('should return PAYMENT_FAILED when payment service fails', async () => {
      const mockProduct = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      mockPaymentService.processPayment.mockResolvedValue({
        success: false,
        error: 'Payment declined',
      });

      const result = await useCase.execute(validCommand);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value).toBe('PAYMENT_FAILED');
      }

      expect(mockTransactionRepository.updateStatus).toHaveBeenCalledWith(
        expect.any(String),
        TransactionStatus.DECLINED,
      );
    });

    it('should handle unexpected errors', async () => {
      const mockProduct = new Product(
        '1',
        'Product 1',
        'Desc 1',
        100,
        10,
        'category1',
      );
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockPaymentService.processPayment.mockRejectedValue(
        new Error('Unexpected error'),
      );

      const result = await useCase.execute(validCommand);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value).toBe('UNKNOWN_ERROR');
      }
    });
  });
});
