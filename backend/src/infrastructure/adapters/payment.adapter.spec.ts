import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { PaymentAdapter } from './payment.adapter';

jest.mock('axios');
jest.mock('crypto');

describe('PaymentAdapter', () => {
  let adapter: PaymentAdapter;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'WOMPI_SANDBOX_URL':
                  return 'https://sandbox.wompi.co/v1';
                case 'WOMPI_PUBLIC_KEY':
                  return 'pub_test_123';
                case 'WOMPI_PRIVATE_KEY':
                  return 'prv_test_123';
                case 'WOMPI_INTEGRITY_KEY':
                  return 'int_test_123';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    adapter = module.get<PaymentAdapter>(PaymentAdapter);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('constructor', () => {
    it('should initialize with config values', () => {
      expect(adapter).toBeDefined();
      expect(configService.get).toHaveBeenCalledTimes(4);
    });

    it('should throw error if required keys are missing', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      expect(() => new PaymentAdapter(configService)).toThrowError(
        'Missing Wompi configuration keys',
      );
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const mockAcceptanceToken = 'acceptance_token_123';
      const mockResponse = {
        data: {
          data: {
            id: 'txn_123',
            status: 'APPROVED',
          },
        },
      };

      jest
        .spyOn(adapter as any, 'getAcceptanceToken')
        .mockResolvedValue(mockAcceptanceToken);
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('signature_123'),
      });

      const result = await adapter.processPayment(
        100,
        'card_token_123',
        'test@example.com',
        'ref_123',
        { fullName: 'Test User', phoneNumber: '1234567890' },
        {
          addressLine1: '123 Street',
          city: 'Bogota',
          region: 'Cundinamarca',
          postalCode: '110111',
          phoneNumber: '1234567890',
        },
      );

      expect(result).toEqual({
        success: true,
        transactionId: 'txn_123',
        status: 'APPROVED',
      });
    });

    it('should handle payment failure', async () => {
      const mockAcceptanceToken = 'acceptance_token_123';
      const mockError = {
        response: {
          data: {
            error: {
              type: 'VALIDATION_ERROR',
              messages: ['Invalid card token'],
            },
          },
        },
      };

      jest
        .spyOn(adapter as any, 'getAcceptanceToken')
        .mockResolvedValue(mockAcceptanceToken);
      (axios.post as jest.Mock).mockRejectedValue(mockError);

      const result = await adapter.processPayment(
        100,
        'invalid_token',
        'test@example.com',
        'ref_123',
        { fullName: 'Test User', phoneNumber: '1234567890' },
        {
          addressLine1: '123 Street',
          city: 'Bogota',
          region: 'Cundinamarca',
          phoneNumber: '1234567890',
        },
      );

      expect(result).toEqual({
        success: false,
        error: 'Invalid card token',
        status: 'ERROR',
      });
    });
  });

  describe('getAcceptanceToken', () => {
    it('should get acceptance token', async () => {
      const mockResponse = {
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'token_123',
            },
          },
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await (adapter as any).getAcceptanceToken();
      expect(result).toBe('token_123');
    });

    it('should handle error getting acceptance token', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect((adapter as any).getAcceptanceToken()).rejects.toThrow(
        'Could not get acceptance token',
      );
    });
  });

  describe('calculateSignature', () => {
    it('should calculate signature correctly', () => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashed_value'),
      };
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);

      const result = (adapter as any).calculateSignature(
        'ref_123',
        10000,
        'COP',
      );

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(mockHash.update).toHaveBeenCalledWith(
        'ref_12310000COPint_test_123',
      );
      expect(mockHash.digest).toHaveBeenCalledWith('hex');
      expect(result).toBe('hashed_value');
    });
  });

  describe('parseError', () => {
    it('should parse connection error', () => {
      const error = new Error('Network error');
      const result = (adapter as any).parseError(error);
      expect(result).toBe('Connection error with payment server');
    });

    it('should parse shipping address errors', () => {
      const error = {
        response: {
          data: {
            error: {
              messages: {
                shipping_address: ['Invalid city', 'Missing postal code'],
              },
            },
          },
        },
      };

      const result = (adapter as any).parseError(error);
      expect(result).toBe(
        'Shipping address errors: Invalid city, Missing postal code',
      );
    });

    it('should parse general error messages', () => {
      const error = {
        response: {
          data: {
            error: {
              messages: ['Invalid card', 'Insufficient funds'],
            },
          },
        },
      };

      const result = (adapter as any).parseError(error);
      expect(result).toBe('Invalid card, Insufficient funds');
    });

    it('should parse error type when no messages', () => {
      const error = {
        response: {
          data: {
            error: {
              type: 'AUTH_ERROR',
              message: 'Invalid API key',
            },
          },
        },
      };

      const result = (adapter as any).parseError(error);
      expect(result).toBe('Invalid API key');
    });
  });
});
