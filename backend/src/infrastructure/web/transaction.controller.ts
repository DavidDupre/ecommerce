import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ProcessPaymentUseCase } from '../../core/use-cases/process-payment.use-case';
import { TransactionRepository } from '../../core/ports/transaction.repository.port';

@Controller('onboarding/transaction')
export class TransactionController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  @Post()
  async createTransaction(
    @Body()
    body: {
      products: Array<{ productId: string; quantity: number }>;
      creditCardToken: string;
      customerEmail: string;
      customerName: string;
      deliveryAddress: string;
      city: string;
      region: string;
      postalCode: string;
      phoneNumber: string;
      shippingCost: number;
    },
  ) {
    if (!body.products || !Array.isArray(body.products)) {
      return {
        success: false,
        error: 'PRODUCTS_INVALID_FORMAT',
      };
    }
    const result = await this.processPaymentUseCase.execute(body);

    if (result.isRight()) {
      const value = result.value as {
        transactionId: string;
        status: string;
        trackingNumber: string;
        totalAmount: number;
      };
      return {
        success: true,
        transactionId: value.transactionId,
        status: value.status,
        trackingNumber: value.trackingNumber,
        totalAmount: value.totalAmount,
        estimatedDelivery: {
          minDays: 5,
          maxDays: 15,
          message: 'Entrega estimada: 5 a 15 días hábiles',
        },
      };
    } else {
      return {
        success: false,
        error: result.value,
      };
    }
  }

  @Get(':trackingNumber')
  async getTransactionByTrackingNumber(
    @Param('trackingNumber') trackingNumber: string,
  ) {
    const transaction =
      await this.transactionRepository.findByTrackingNumber(trackingNumber);

    if (!transaction) {
      return {
        success: false,
        message: 'Transacción no encontrada',
      };
    }

    return {
      success: true,
      data: {
        status: transaction.status,
        products: transaction.products,
        customerName: transaction.customerName,
        deliveryAddress: transaction.deliveryAddress,
        city: transaction.city,
        postalCode: transaction.postalCode,
        totalAmount: transaction.totalAmount,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        estimatedDelivery: {
          minDays: 5,
          maxDays: 15,
          message: 'Entrega estimada: 5 a 15 días hábiles',
        },
      },
    };
  }
}
