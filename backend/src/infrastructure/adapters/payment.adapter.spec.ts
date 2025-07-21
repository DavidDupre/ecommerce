// src/infrastructure/adapters/payment.adapter.spec.ts
import { Test } from '@nestjs/testing';
import { PaymentAdapter } from './payment.adapter';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('mocked-signature'),
}));

describe('PaymentAdapter', () => {
  let paymentAdapter: PaymentAdapter;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    } as any;

    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'WOMPI_SANDBOX_URL':
          return 'https://sandbox.wompi.co/v1';
        case 'WOMPI_PUBLIC_KEY':
          return 'pub_test_123';
        case 'WOMPI_PRIVATE_KEY':
          return 'prv_test_123';
        case 'WOMPI_INTEGRITY_KEY':
          return 'integrity_test_123';
        default:
          return null;
      }
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentAdapter,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    paymentAdapter = moduleRef.get<PaymentAdapter>(PaymentAdapter);
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      // Mock acceptance token request
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'acceptance-token-123',
            },
          },
        },
      });

      // Mock payment request
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: {
            id: 'txn-123',
            status: 'APPROVED',
          },
        },
      });

      const result = await paymentAdapter.processPayment(
        100,
        'card-token-123',
        'test@example.com',
        'ref-123',
        {
          fullName: 'Test User',
          phoneNumber: '1234567890',
        },
        {
          addressLine1: '123 Street',
          city: 'Bogota',
          region: 'Bogota',
          postalCode: '110111',
        },
      );

      expect(result).toEqual({
        success: true,
        transactionId: 'txn-123',
        status: 'APPROVED',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://sandbox.wompi.co/v1/transactions',
        expect.objectContaining({
          acceptance_token: 'acceptance-token-123',
          amount_in_cents: 10000, // 100 * 100
          reference: 'ref-123',
          signature: 'mocked-signature',
        }),
        expect.any(Object),
      );
    });

    it('should handle payment failure', async () => {
      // Mock acceptance token request
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'acceptance-token-123',
            },
          },
        },
      });

      // Mock payment request
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: {
            id: 'txn-123',
            status: 'DECLINED',
            status_message: 'Insufficient funds',
          },
        },
      });

      const result = await paymentAdapter.processPayment(
        100,
        'card-token-123',
        'test@example.com',
        'ref-123',
        {
          fullName: 'Test User',
          phoneNumber: '1234567890',
        },
        {
          addressLine1: '123 Street',
          city: 'Bogota',
          region: 'Bogota',
          postalCode: '110111',
        },
      );

      expect(result).toEqual({
        success: false,
        transactionId: 'txn-123',
        status: 'DECLINED',
        error: 'Insufficient funds',
      });
    });

    it('should throw error when missing configuration', async () => {
      mockConfigService.get.mockImplementation(() => null);

      await expect(
        new PaymentAdapter(mockConfigService).processPayment(
          100,
          'token',
          'email',
          'ref',
          { fullName: 'name', phoneNumber: '123' },
          { addressLine1: 'addr', city: 'city', region: 'region' },
        ),
      ).rejects.toThrow('Missing Wompi configuration keys');
    });
  });

  describe('normalizeRegion', () => {
    it('should normalize known regions', () => {
      expect(paymentAdapter['normalizeRegion']('bogota')).toBe('Bogotá, D.C.');
      expect(paymentAdapter['normalizeRegion']('BOGOTÁ')).toBe('Bogotá, D.C.');
      expect(paymentAdapter['normalizeRegion']('cundinamarca')).toBe(
        'Cundinamarca',
      );
    });

    it('should return original value for unknown regions', () => {
      expect(paymentAdapter['normalizeRegion']('antioquia')).toBe('antioquia');
    });
  });
});
