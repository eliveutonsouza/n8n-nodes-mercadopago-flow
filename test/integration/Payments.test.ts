/**
 * Testes de integração para operações de Payments
 */

import { PaymentsResource } from '../../nodes/MercadoPago/resources/PaymentsResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';
import { mockPixPaymentResponse, mockPixPaymentApproved } from '../mocks/mercado-pago-mocks';

// Mock do apiRequest
jest.mock('../../nodes/MercadoPago/GenericFunctions', () => ({
	apiRequest: jest.fn(),
	buildUrl: jest.fn((template: string, params: Record<string, string | number>) => {
		let url = template;
		for (const [key, value] of Object.entries(params)) {
			url = url.replace(`:${key}`, String(value));
		}
		return url;
	}),
}));

describe('PaymentsResource Integration Tests', () => {
	let resource: PaymentsResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	beforeEach(() => {
		resource = new PaymentsResource();
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'TEST-TOKEN',
				baseUrl: 'https://api.mercadopago.com',
			}),
			helpers: {
				request: jest.fn(),
			} as any,
		};
		jest.clearAllMocks();
	});

	describe('create', () => {
		it('deve criar pagamento com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					transactionAmount: 100.50,
					paymentMethodId: 'master',
					payerEmail: 'test@example.com',
					description: 'Test payment',
					installments: 1,
					capture: true,
					token: 'test-token-123',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPixPaymentApproved);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'payments');

			// Assert
			expect(result).toEqual(mockPixPaymentApproved);
			expect(apiRequest).toHaveBeenCalled();
			const callArgs = (apiRequest as jest.Mock).mock.calls[0];
			expect(callArgs[0]).toBe('POST');
			expect(callArgs[1]).toBe('/v1/payments');
			expect(callArgs[2]).toMatchObject({
				transaction_amount: 100.50,
				payment_method_id: 'master',
				payer: expect.objectContaining({
					email: 'test@example.com',
				}),
			});
			expect(callArgs[4]).toHaveProperty('X-Idempotency-Key');
		});

		it('deve validar email inválido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					transactionAmount: 100,
					paymentMethodId: 'master',
					payerEmail: 'invalid-email',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'payments')
			).rejects.toThrow('Email do pagador inválido');
		});
	});

	describe('get', () => {
		it('deve buscar pagamento por ID com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					paymentId: '123456789',
				};
				return params[name];
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPixPaymentResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'payments');

			// Assert
			expect(result).toEqual(mockPixPaymentResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/payments/123456789'
			);
		});

		it('deve lançar erro quando paymentId não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => {
				return '';
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'payments')
			).rejects.toThrow('ID do pagamento é obrigatório');
		});
	});

	describe('list', () => {
		it('deve listar pagamentos com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					status: 'approved',
					sort: 'date_created',
					criteria: 'desc',
					limit: 50,
				};
				return params[name] ?? '';
			});

			const mockResponse = {
				results: [mockPixPaymentResponse, mockPixPaymentApproved],
				paging: {
					total: 2,
					limit: 50,
					offset: 0,
				},
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'payments');

			// Assert
			expect(result).toEqual(mockResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/payments',
				undefined,
				expect.objectContaining({
					status: 'approved',
					sort: 'date_created',
					criteria: 'desc',
					limit: 50,
				})
			);
		});
	});

	describe('search', () => {
		it('deve buscar pagamentos por external reference', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					externalReference: 'REF-123',
					sort: 'date_created',
					criteria: 'desc',
				};
				return params[name] ?? '';
			});

			const mockResponse = {
				results: [mockPixPaymentResponse],
				paging: {
					total: 1,
					limit: 50,
					offset: 0,
				},
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'search', 'payments');

			// Assert
			expect(result).toEqual(mockResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/payments/search',
				undefined,
				expect.objectContaining({
					external_reference: 'REF-123',
				})
			);
		});
	});

	describe('refund', () => {
		it('deve fazer reembolso total com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					paymentId: '123456789',
					refundType: 'full',
				};
				return params[name] ?? '';
			});

			const mockRefundResponse = {
				id: '1627096680',
				payment_id: 123456789,
				amount: 100.50,
				status: 'approved',
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockRefundResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'refund', 'payments');

			// Assert
			expect(result).toEqual(mockRefundResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'POST',
				'/v1/payments/123456789/refunds',
				{},
				undefined,
				expect.objectContaining({
					'X-Idempotency-Key': expect.anything(),
				})
			);
		});

		it('deve fazer reembolso parcial com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					paymentId: '123456789',
					refundType: 'partial',
					refundAmount: 50.25,
				};
				return params[name] ?? '';
			});

			const mockRefundResponse = {
				id: '1627096681',
				payment_id: 123456789,
				amount: 50.25,
				status: 'approved',
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockRefundResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'refund', 'payments');

			// Assert
			expect(result).toEqual(mockRefundResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'POST',
				'/v1/payments/123456789/refunds',
				expect.objectContaining({
					amount: 50.25,
				}),
				undefined,
				expect.objectContaining({
					'X-Idempotency-Key': expect.anything(),
				})
			);
		});

		it('deve lançar erro quando refundAmount não é fornecido para reembolso parcial', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					paymentId: '123456789',
					refundType: 'partial',
					refundAmount: 0,
				};
				return params[name] ?? 0;
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'refund', 'payments')
			).rejects.toThrow('Valor do reembolso parcial é obrigatório');
		});
	});

	describe('capture', () => {
		it('deve capturar pagamento pré-autorizado com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					paymentId: '123456789',
				};
				return params[name] ?? null;
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockPixPaymentApproved);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'capture', 'payments');

			// Assert
			expect(result).toEqual(mockPixPaymentApproved);
			expect(apiRequest).toHaveBeenCalled();
			const callArgs = (apiRequest as jest.Mock).mock.calls[0];
			expect(callArgs[0]).toBe('PUT');
			expect(callArgs[1]).toBe('/v1/payments/123456789');
			expect(callArgs[2]).toMatchObject({ capture: true });
			expect(callArgs[4]).toHaveProperty('X-Idempotency-Key');
		});
	});

	describe('cancel', () => {
		it('deve cancelar pagamento com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					paymentId: '123456789',
				};
				return params[name] ?? null;
			});

			const mockCancelledPayment = {
				...mockPixPaymentResponse,
				status: 'cancelled',
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockCancelledPayment);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'cancel', 'payments');

			// Assert
			expect(result).toEqual(mockCancelledPayment);
			expect(apiRequest).toHaveBeenCalled();
			const callArgs = (apiRequest as jest.Mock).mock.calls[0];
			expect(callArgs[0]).toBe('PUT');
			expect(callArgs[1]).toBe('/v1/payments/123456789');
			expect(callArgs[2]).toMatchObject({ status: 'cancelled' });
			expect(callArgs[4]).toHaveProperty('X-Idempotency-Key');
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'payments')
			).rejects.toThrow('Operação "invalid" não é suportada');
		});
	});
});

