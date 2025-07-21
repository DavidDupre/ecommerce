import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../core/ports/payment.service.port';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentAdapter implements PaymentService {
  private readonly baseUrl?: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrityKey: string;

  constructor(private readonly configService: ConfigService) {
    const baseUrl = this.configService.get<string>('WOMPI_SANDBOX_URL');
    const publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('WOMPI_PRIVATE_KEY');
    const integrityKey = this.configService.get<string>('WOMPI_INTEGRITY_KEY');

    if (!publicKey || !privateKey || !integrityKey) {
      throw new Error('Missing Wompi configuration keys');
    }

    this.baseUrl = baseUrl;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.integrityKey = integrityKey;
  }

  async processPayment(
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
      phoneNumber: string;
    },
  ): Promise<{
    success: boolean;
    transactionId?: string;
    status?: string;
    error?: string;
  }> {
    try {
      // 1. Get acceptance token
      const acceptanceToken = await this.getAcceptanceToken();

      // 2. Prepare payload with proper shipping address format
      const amountInCents = Math.round(amount * 100);
      const payload = {
        acceptance_token: acceptanceToken,
        amount_in_cents: amountInCents,
        currency: 'COP',
        customer_email: customerEmail,
        payment_method: {
          type: 'CARD',
          token: creditCardToken,
          installments: 1,
        },
        reference: reference,
        customer_data: {
          full_name: customerData.fullName,
          phone_number: customerData.phoneNumber,
          legal_id: '1234567890', // Required field (dummy value)
          legal_id_type: 'CC', // Required field (CC = Cédula de Ciudadanía)
        },
        shipping_address: {
          address_line_1: shippingAddress.addressLine1,
          city: shippingAddress.city,
          region: shippingAddress.region,
          country: 'CO', // Required by Wompi
          postal_code: shippingAddress.postalCode || '000000',
          phone_number: shippingAddress.phoneNumber,
        },
        signature: this.calculateSignature(reference, amountInCents, 'COP'),
      };

      // 3. Make the request to Wompi
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // 4. Process response
      const transactionResponse = response.data.data;
      const isSuccess = ['APPROVED', 'PENDING'].includes(
        transactionResponse.status,
      );

      return {
        success: isSuccess,
        transactionId: transactionResponse.id,
        status: transactionResponse.status,
        error: isSuccess
          ? undefined
          : transactionResponse.status_message || 'Payment failed',
      };
    } catch (error) {
      console.error(
        'Error processing payment:',
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: this.parseError(error),
        status: 'ERROR',
      };
    }
  }

  private async getAcceptanceToken(): Promise<string> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/merchants/${this.publicKey}`,
      );
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      console.error('Error getting acceptance token:', error);
      throw new Error('Could not get acceptance token');
    }
  }

  private calculateSignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const data = `${reference}${amountInCents}${currency}${this.integrityKey}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private parseError(error: any): string {
    if (!error.response) {
      return 'Connection error with payment server';
    }

    // Enhanced error logging
    console.log(
      'Full error response:',
      JSON.stringify(error.response.data, null, 2),
    );

    const paymentError = error.response.data?.error;
    if (!paymentError) {
      return 'Unknown error in payment processing';
    }

    // Handle shipping address validation errors specifically
    if (paymentError.messages?.shipping_address) {
      const addressErrors = paymentError.messages.shipping_address;
      if (Array.isArray(addressErrors)) {
        return `Shipping address errors: ${addressErrors.join(', ')}`;
      }
      return `Shipping address error: ${JSON.stringify(addressErrors)}`;
    }

    if (paymentError.messages) {
      if (Array.isArray(paymentError.messages)) {
        return paymentError.messages.join(', ');
      }
      return String(paymentError.messages);
    }

    return paymentError.message || `Payment error: ${paymentError.type}`;
  }
}
