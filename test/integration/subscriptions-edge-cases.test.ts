/**
 * Testes de integração para casos extremos de Assinaturas
 */

import { PaymentMercadoPago } from '../../nodes/PaymentMercadoPago/PaymentMercadoPago.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import { mockSubscriptionResponse } from '../mocks/mercado-pago-mocks';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Subscriptions Edge Cases', () => {
	let node: PaymentMercadoPago;
	let mockExecuteFunctions: MockExecuteFunctions;

	beforeEach(() => {
		node = new PaymentMercadoPago();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createSubscription - Casos Extremos', () => {
		it('deve criar assinatura com cardTokenId e status authorized', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'create',
						planId: 'plan-123',
						payerEmail: 'test@example.com',
						cardTokenId: 'CARD_TOKEN_123',
						subscriptionStatus: 'authorized',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				{
					...mockSubscriptionResponse,
					status: 'authorized',
					card_token_id: 'CARD_TOKEN_123',
				},
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.status).toBe('authorized');
			expect(result[0][0].json.provider).toBe('mercado_pago');
			expect(result[0][0].json.type).toBe('subscription');
		});

		it('deve criar assinatura sem cardTokenId e retornar init_point', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'create',
						planId: 'plan-123',
						payerEmail: 'test@example.com',
						subscriptionStatus: 'pending',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				{
					...mockSubscriptionResponse,
					status: 'pending',
					sandbox_init_point:
						'https://sandbox.mercadopago.com.br/subscriptions/checkout?preapproval_id=sub-123',
				},
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.status).toBe('pending');
			expect(result[0][0].json.url).toBeDefined();
			expect(result[0][0].json.url).toContain('sandbox.mercadopago.com.br');
		});

		it('deve lançar erro se status authorized sem cardTokenId', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'create',
						planId: 'plan-123',
						payerEmail: 'test@example.com',
						subscriptionStatus: 'authorized',
						// cardTokenId não fornecido
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('card_token_id');
		});
	});
});

