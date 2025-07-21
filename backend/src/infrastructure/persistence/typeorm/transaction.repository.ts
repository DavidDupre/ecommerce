// src/infrastructure/persistence/typeorm/transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from '../../../core/ports/transaction.repository.port';
import { Transaction } from '../../../core/entities/transaction.entity';
import { TransactionOrmEntity } from './transaction.orm-entity';
import { TransactionStatus } from '../../../core/entities/transaction.entity';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async create(transaction: Transaction): Promise<void> {
    const transactionOrm = {
      id: transaction.id,
      products: transaction.products,
      totalAmount: transaction.totalAmount,
      status: transaction.status,
      customerEmail: transaction.customerEmail,
      customerName: transaction.customerName,
      deliveryAddress: transaction.deliveryAddress,
      city: transaction.city,
      postalCode: transaction.postalCode,
      phoneNumber: transaction.phoneNumber,
      shippingCost: transaction.shippingCost,
      trackingNumber: transaction.trackingNumber,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    await this.repository.save(transactionOrm);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repository.update({ id }, { status });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.repository.findOne({ where: { id } });
    if (!transaction) return null;

    return this.mapToDomain(transaction);
  }

  async findByTrackingNumber(
    trackingNumber: string,
  ): Promise<Transaction | null> {
    const transaction = await this.repository.findOne({
      where: { trackingNumber },
    });

    if (!transaction) return null;

    return this.mapToDomain(transaction);
  }

  async generateTrackingNumber(): Promise<string> {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    const datePart = new Date().getTime().toString().slice(-6);
    return `WM${datePart}${randomPart}`;
  }

  private mapToDomain(ormEntity: TransactionOrmEntity): Transaction {
    return new Transaction(
      ormEntity.id,
      ormEntity.products,
      Number(ormEntity.totalAmount),
      ormEntity.status as TransactionStatus,
      ormEntity.customerEmail,
      ormEntity.customerName,
      ormEntity.deliveryAddress,
      ormEntity.city,
      ormEntity.postalCode,
      ormEntity.phoneNumber,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      Number(ormEntity.shippingCost),
      ormEntity.trackingNumber,
    );
  }
}
