import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../core/ports/payment.service.port';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentAdapter implements PaymentService {
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrityKey: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'WOMPI_API_URL',
      'https://api-sandbox.wompi.co/v1',
    );
    this.publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    this.privateKey = this.configService.get<string>('WOMPI_PRIVATE_KEY');
    this.integrityKey = this.configService.get<string>('WOMPI_INTEGRITY_KEY');
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
    },
  ): Promise<{
    success: boolean;
    transactionId?: string;
    status?: string;
    error?: string;
  }> {
    try {
      // 1. Obtener token de aceptación
      const acceptanceToken = await this.getAcceptanceToken();

      // 2. Preparar payload con firma
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
          legal_id: '1234567890',
          legal_id_type: 'CC',
        },
        shipping_address: {
          address_line_1: shippingAddress.addressLine1,
          city: shippingAddress.city,
          region: shippingAddress.region,
          country: 'CO',
          postal_code: shippingAddress.postalCode || '000000',
        },
        signature: this.calculateSignature(reference, amountInCents, 'COP'),
      };

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

      const TransactionResponse = response.data.data;
      const isSuccess = ['APPROVED', 'PENDING'].includes(
        TransactionResponse.status,
      );

      return {
        success: isSuccess,
        transactionId: TransactionResponse.id,
        status: TransactionResponse.status,
        error: isSuccess
          ? undefined
          : TransactionResponse.status_message || 'Payment failed',
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
    if (!error.response) return 'Error de conexión con el servidor de pagos';

    const paymentError = error.response.data?.error;
    if (!paymentError) return 'Error desconocido en el procesamiento del pago';

    if (paymentError.messages) {
      if (Array.isArray(paymentError.messages)) {
        return paymentError.messages.join(', ');
      }
      return String(paymentError.messages);
    }

    return paymentError.message || `Error en el pago: ${paymentError.type}`;
  }
}
