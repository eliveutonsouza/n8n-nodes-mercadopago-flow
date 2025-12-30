/**
 * Testes de integração para operações de Assinaturas
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import {
	mockSubscriptionResponse,
} from '../mocks/mercado-pago-mocks';
import { mockSubscriptionData } from '../mocks/fixtures';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Subscriptions Integration Tests', () => {
	let node: PixPayment;
	let mockExecuteFunctions: MockExecuteFunctions;
	const baseUrl = 'https://api.mercadopago.com';

	beforeEach(() => {
		node = new PixPayment();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createSubscription', () => {
		it('deve criar assinatura com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'create',
					planId: mockSubscriptionData.planId,
					payerEmail: mockSubscriptionData.payerEmail,
					payerDocument: mockSubscriptionData.payerDocument,
					startDate: mockSubscriptionData.startDate,
					trialPeriodDays: mockSubscriptionData.trialPeriodDays,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockSubscriptionResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(result[0][0].json.id).toBe(mockSubscriptionResponse.id);
			expect(result[0][0].json.status).toBe('authorized');
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'POST',
					url: `${baseUrl}/preapproval`,
				}),
			);
		});

		it('deve validar email inválido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'create',
					planId: 'plan-123',
					payerEmail: 'email-invalido',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('E-mail do pagador inválido');
		});

		it('deve validar CPF/CNPJ inválido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'create',
					planId: 'plan-123',
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
	});

	describe('getSubscription', () => {
		it('deve consultar assinatura existente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'get',
					subscriptionId: 'sub-123',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockSubscriptionResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(result[0][0].json.id).toBe(mockSubscriptionResponse.id);
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval/sub-123`,
				}),
			);
		});
	});

	describe('pauseSubscription', () => {
		it('deve pausar assinatura com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'pause',
					subscriptionId: 'sub-123',
				};
				return params[name];
			});

			const pausedSubscription = { ...mockSubscriptionResponse, status: 'paused' };
			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				pausedSubscription,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.status).toBe('paused');
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'PUT',
					body: { status: 'paused' },
				}),
			);
		});
	});

	describe('resumeSubscription', () => {
		it('deve retomar assinatura com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'resume',
					subscriptionId: 'sub-123',
				};
				return params[name];
			});

			const resumedSubscription = { ...mockSubscriptionResponse, status: 'authorized' };
			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				resumedSubscription,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.status).toBe('authorized');
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'PUT',
					body: { status: 'authorized' },
				}),
			);
		});
	});

	describe('cancelSubscription', () => {
		it('deve cancelar assinatura com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'cancel',
					subscriptionId: 'sub-123',
				};
				return params[name];
			});

			const cancelledSubscription = { ...mockSubscriptionResponse, status: 'cancelled' };
			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				cancelledSubscription,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.status).toBe('cancelled');
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'PUT',
					body: { status: 'cancelled' },
				}),
			);
		});
	});

	describe('listSubscriptions', () => {
		it('deve listar assinaturas com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'subscriptions',
					operation: 'list',
				};
				return params[name];
			});

			const listResponse = {
				results: [mockSubscriptionResponse],
				paging: { total: 1, limit: 10, offset: 0 },
			};

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				listResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval/search`,
				}),
			);
		});
	});
});

