/**
 * Testes de integração para Pagamentos Recorrentes
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import { mockSubscriptionResponse } from '../mocks/mercado-pago-mocks';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Recurring Payments Integration Tests', () => {
	let node: PixPayment;
	let mockExecuteFunctions: MockExecuteFunctions;
	const baseUrl = 'https://api.mercadopago.com';

	beforeEach(() => {
		node = new PixPayment();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createRecurringPayment', () => {
		it('deve criar pagamento recorrente com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'recurringPayments',
					operation: 'create',
					planId: 'plan-123',
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
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval/plan-123`,
				}),
			);
		});
	});

	describe('getRecurringPayment', () => {
		it('deve consultar pagamento recorrente existente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'recurringPayments',
					operation: 'get',
					recurringPaymentId: 'recurring-123',
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
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval/recurring-123`,
				}),
			);
		});
	});

	describe('listRecurringPayments', () => {
		it('deve listar pagamentos recorrentes sem filtro', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'recurringPayments',
					operation: 'list',
					customerId: '',
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

		it('deve listar pagamentos recorrentes com filtro de customerId', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'recurringPayments',
					operation: 'list',
					customerId: 'customer-123',
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
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval/search?payer_id=customer-123`,
				}),
			);
		});
	});

	describe('cancelRecurringPayment', () => {
		it('deve cancelar pagamento recorrente com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'recurringPayments',
					operation: 'cancel',
					recurringPaymentId: 'recurring-123',
				};
				return params[name];
			});

			const cancelledRecurring = { ...mockSubscriptionResponse, status: 'cancelled' };
			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				cancelledRecurring,
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
});

