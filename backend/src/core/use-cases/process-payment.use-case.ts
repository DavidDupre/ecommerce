import { left, right } from '../../shared/either';
import { Transaction, TransactionStatus } from '../entities/transaction.entity';
import { ProductRepository } from '../ports/product.repository.port';
import { TransactionRepository } from '../ports/transaction.repository.port';
import { PaymentService } from '../ports/payment.service.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('PaymentService')
    private readonly paymentService: PaymentService,
  ) {}

  async execute(command: {
    products: Array<{ productId: string; quantity: number }>;
    creditCardToken: string;
    customerEmail: string;
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    city: string;
    region: string;
    postalCode: string;
    shippingCost: number;
  }) {
    try {
      const productsWithDetails = [];
      let totalAmount = 0;

      for (const item of command.products) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          return left('PRODUCT_NOT_FOUND');
        }
        if (product.stock < item.quantity) {
          return left('INSUFFICIENT_STOCK');
        }

        productsWithDetails.push({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += product.price * item.quantity;
      }

      totalAmount += command.shippingCost;

      const transactionId = `txn-${require('uuid').v4()}`;
      const trackingNumber =
        await this.transactionRepository.generateTrackingNumber();

      // Crear transacción PENDING
      const transaction = new Transaction(
        transactionId,
        productsWithDetails,
        totalAmount,
        TransactionStatus.PENDING,
        command.customerEmail,
        command.customerName,
        command.deliveryAddress,
        command.city,
        command.postalCode,
        command.phoneNumber,
        new Date(),
        new Date(),
        command.shippingCost,
        trackingNumber,
      );

      await this.transactionRepository.create(transaction);

      const paymentResult = await this.paymentService.processPayment(
        totalAmount,
        command.creditCardToken,
        command.customerEmail,
        transactionId,
        {
          fullName: command.customerName,
          phoneNumber: command.phoneNumber,
        },
        {
          addressLine1: command.deliveryAddress,
          city: command.city,
          region: command.region,
          postalCode: command.postalCode,
          phoneNumber: command.phoneNumber,
        },
      );

      if (!paymentResult.success) {
        await this.transactionRepository.updateStatus(
          transactionId,
          TransactionStatus.DECLINED,
        );
        return left('PAYMENT_FAILED');
      }

      const newStatus =
        paymentResult.status === 'APPROVED'
          ? TransactionStatus.APPROVED
          : TransactionStatus.PENDING;

      await this.transactionRepository.updateStatus(transactionId, newStatus);

      if (newStatus === TransactionStatus.APPROVED) {
        for (const item of command.products) {
          const product = await this.productRepository.findById(item.productId);
          if (product) {
            product.reduceStock(item.quantity);
            await this.productRepository.save(product);
          }
        }
      }

      return right({
        transactionId,
        status: newStatus,
        trackingNumber,
        totalAmount,
      });
    } catch (error) {
      console.error('Error en ProcessPaymentUseCase:', error);
      return left('UNKNOWN_ERROR');
    }
  }
}
