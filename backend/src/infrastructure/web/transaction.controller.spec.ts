import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { ProcessPaymentUseCase } from '../../core/use-cases/process-payment.use-case';
import { TransactionRepository } from '../../core/ports/transaction.repository.port';

describe('TransactionController', () => {
  let controller: TransactionController;
  let processPaymentUseCase: ProcessPaymentUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: ProcessPaymentUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'TransactionRepository',
          useValue: {
            findByTrackingNumber: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    processPaymentUseCase = module.get<ProcessPaymentUseCase>(
      ProcessPaymentUseCase,
    );
    transactionRepository = module.get<TransactionRepository>(
      'TransactionRepository',
    );
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockResult = {
        isRight: () => true,
        value: {
          transactionId: 'txn_123',
          status: 'PENDING',
          trackingNumber: 'WM123456',
          totalAmount: 100,
        },
      };

      (processPaymentUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await controller.createTransaction({
        products: [{ productId: 'prod_1', quantity: 2 }],
        creditCardToken: 'card_token_123',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        region: 'Cundinamarca',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
      });

      expect(result).toEqual({
        success: true,
        transactionId: 'txn_123',
        status: 'PENDING',
        trackingNumber: 'WM123456',
        totalAmount: 100,
        estimatedDelivery: {
          minDays: 5,
          maxDays: 15,
          message: 'Entrega estimada: 5 a 15 días hábiles',
        },
      });
    });

    it('should handle invalid products format', async () => {
      const result = await controller.createTransaction({
        products: null as any,
        creditCardToken: 'card_token_123',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        region: 'Cundinamarca',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
      });

      expect(result).toEqual({
        success: false,
        error: 'PRODUCTS_INVALID_FORMAT',
      });
    });

    it('should handle payment failure', async () => {
      const mockResult = {
        isRight: () => false,
        value: 'PAYMENT_FAILED',
      };

      (processPaymentUseCase.execute as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await controller.createTransaction({
        products: [{ productId: 'prod_1', quantity: 2 }],
        creditCardToken: 'invalid_token',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        deliveryAddress: '123 Street',
        city: 'Bogota',
        region: 'Cundinamarca',
        postalCode: '110111',
        phoneNumber: '1234567890',
        shippingCost: 10,
      });

      expect(result).toEqual({
        success: false,
        error: 'PAYMENT_FAILED',
      });
    });
  });

  describe('getTransactionByTrackingNumber', () => {
    it('should return transaction details', async () => {
      const mockTransaction = {
        id: 'txn_123',
        products: [{ productId: 'prod_1', quantity: 2 }],
        totalAmount: 100,
        status: 'PENDING',
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

      (
        transactionRepository.findByTrackingNumber as jest.Mock
      ).mockResolvedValue(mockTransaction);

      const result =
        await controller.getTransactionByTrackingNumber('WM123456');

      expect(result).toEqual({
        success: true,
        data: {
          status: 'PENDING',
          products: [{ productId: 'prod_1', quantity: 2 }],
          customerName: 'Test User',
          deliveryAddress: '123 Street',
          city: 'Bogota',
          postalCode: '110111',
          totalAmount: 100,
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
      (
        transactionRepository.findByTrackingNumber as jest.Mock
      ).mockResolvedValue(null);

      const result = await controller.getTransactionByTrackingNumber('INVALID');

      expect(result).toEqual({
        success: false,
        message: 'Transacción no encontrada',
      });
    });
  });
});
