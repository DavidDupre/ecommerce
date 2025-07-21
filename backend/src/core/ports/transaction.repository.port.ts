import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../entities/transaction.entity';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Transaction | null>;
  generateTrackingNumber(): Promise<string>;
}
