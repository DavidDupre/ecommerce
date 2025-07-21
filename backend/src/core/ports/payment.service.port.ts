export interface PaymentService {
  processPayment(
    amount: number,
    creditCardToken: string,
    customerEmail: string,
    reference: string,
    customerData: {
      fullName: string;
      phoneNumber: string;
    },
    shippingAddress: {
      addressLine1: string;
      city: string;
      region: string;
      postalCode?: string;
    },
  ): Promise<{
    success: boolean;
    transactionId?: string;
    status?: string;
    error?: string;
  }>;
}
