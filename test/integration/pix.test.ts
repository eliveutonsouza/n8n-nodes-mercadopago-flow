/**
 * Testes de integração para operações PIX
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import {
	mockPixPaymentResponse,
	mockPixPaymentApproved,
	mockRefundResponse,
	mockNotFoundError,
} from '../mocks/mercado-pago-mocks';
import { mockPixPaymentData } from '../mocks/fixtures';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('PIX Integration Tests', () => {
	let node: PixPayment;
	let mockExecuteFunctions: MockExecuteFunctions;
	const baseUrl = 'https://api.mercadopago.com';

	beforeEach(() => {
		node = new PixPayment();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createPixPayment', () => {
		it('deve criar pagamento PIX com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'create',
					amount: mockPixPaymentData.amount,
					description: mockPixPaymentData.description,
					payerEmail: mockPixPaymentData.payerEmail,
					payerDocument: mockPixPaymentData.payerDocument,
					payerName: mockPixPaymentData.payerName,
					expirationDate: mockPixPaymentData.expirationDate,
					externalReference: mockPixPaymentData.externalReference,
					idempotencyKey: mockPixPaymentData.idempotencyKey,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPixPaymentResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(result[0]).toBeDefined();
			expect(result[0][0].json.id).toBe(mockPixPaymentResponse.id);
			expect(result[0][0].json.status).toBe('pending');
			expect(result[0][0].json.qrCode).toBeDefined();
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalled();
		});

		it('deve validar email inválido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'create',
					amount: 10.50,
					description: 'Teste',
					payerEmail: 'email-invalido',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('E-mail do pagador inválido');
		});

		it('deve validar valor menor ou igual a zero', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'create',
					amount: 0,
					description: 'Teste',
					payerEmail: 'teste@example.com',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(mockExecuteFunctions as any),
			).rejects.toThrow('Valor do pagamento deve ser maior que zero');
		});

		it('deve validar CPF/CNPJ inválido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'create',
					amount: 10.50,
					description: 'Teste',
					payerEmail: 'teste@example.com',
					payerDocument: '123',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(mockExecuteFunctions as any),
			).rejects.toThrow('CPF/CNPJ inválido');
		});

		it('deve incluir header de idempotência quando fornecido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'create',
					amount: 10.50,
					description: 'Teste',
					payerEmail: 'teste@example.com',
					idempotencyKey: 'IDEMPOTENCY-KEY-123',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPixPaymentResponse,
			);

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			const callArgs = mockExecuteFunctions.helpers.requestWithAuthentication.call.mock.calls[0];
			expect(callArgs[2].headers['X-Idempotency-Key']).toBe('IDEMPOTENCY-KEY-123');
		});

		it('deve normalizar valor para centavos', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'create',
					amount: 10.50,
					description: 'Teste',
					payerEmail: 'teste@example.com',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPixPaymentResponse,
			);

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			const callArgs = mockExecuteFunctions.helpers.requestWithAuthentication.call.mock.calls[0];
			expect(callArgs[2].body.transaction_amount).toBe(1050);
		});
	});

	describe('getPixPayment', () => {
		it('deve consultar pagamento existente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'get',
					paymentId: '123456789',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPixPaymentApproved,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(result[0][0].json.id).toBe(mockPixPaymentApproved.id);
			expect(result[0][0].json.status).toBe('approved');
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/v1/payments/123456789`,
				}),
			);
		});

		it('deve retornar erro quando pagamento não existe', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'get',
					paymentId: '999999999',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockRejectedValue(
				mockNotFoundError,
			);

			// Act & Assert
			await expect(
				(node.execute as any).call(mockExecuteFunctions as any),
			).rejects.toThrow();
		});

		it('deve validar paymentId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'get',
					paymentId: '',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(mockExecuteFunctions as any),
			).rejects.toThrow('ID do pagamento é obrigatório');
		});
	});

	describe('refundPixPayment', () => {
		it('deve fazer reembolso total quando amount não fornecido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'refund',
					paymentId: '123456789',
					refundAmount: undefined,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockRefundResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			const callArgs = mockExecuteFunctions.helpers.requestWithAuthentication.call.mock.calls[0];
			expect(callArgs[2].body).toBeUndefined();
		});

		it('deve fazer reembolso parcial quando amount fornecido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'refund',
					paymentId: '123456789',
					refundAmount: 5.50,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockRefundResponse,
			);

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			const callArgs = mockExecuteFunctions.helpers.requestWithAuthentication.call.mock.calls[0];
			expect(callArgs[2].body.amount).toBe(550);
		});

		it('deve validar paymentId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'pix',
					operation: 'refund',
					paymentId: '',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				(node.execute as any).call(mockExecuteFunctions as any),
			).rejects.toThrow('ID do pagamento é obrigatório');
		});
	});
});

