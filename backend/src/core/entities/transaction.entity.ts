export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
}

export class Transaction {
  constructor(
    public id: string,
    public products: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
    public totalAmount: number,
    public status: TransactionStatus,
    public customerEmail: string,
    public customerName: string,
    public deliveryAddress: string,
    public city: string,
    public postalCode: string,
    public phoneNumber: string,
    public createdAt: Date,
    public updatedAt: Date,
    public shippingCost: number,
    public trackingNumber?: string,
    public estimatedDeliveryDays?: {
      min: number;
      max: number;
    },
  ) {
    this.estimatedDeliveryDays = {
      min: 5,
      max: 15,
    };
  }
}
