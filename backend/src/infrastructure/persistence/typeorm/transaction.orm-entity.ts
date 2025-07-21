import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column('jsonb')
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  status: string;

  @Column()
  customerEmail: string;

  @Column()
  customerName: string;

  @Column()
  deliveryAddress: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  phoneNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
