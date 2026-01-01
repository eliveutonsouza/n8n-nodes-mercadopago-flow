/**
 * Testes de integração para validar recursos disponíveis
 */

import { PaymentMercadoPago } from '../../nodes/PaymentMercadoPago/PaymentMercadoPago.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Resources Validation', () => {
	let node: PaymentMercadoPago;
	let mockExecuteFunctions: MockExecuteFunctions;

	beforeEach(() => {
		node = new PaymentMercadoPago();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('Recursos Disponíveis', () => {
		it('deve ter exatamente 4 recursos disponíveis', () => {
			const resourceProperty = node.description.properties?.find(
				(p) => p.name === 'resource',
			);

			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.options).toBeDefined();

			if (resourceProperty?.options) {
				const resources = (resourceProperty.options as any[]).map(
					(opt) => opt.value,
				);
				expect(resources.length).toBe(4);
			}
		});

		it('deve ter recursos: pix, plans, subscriptions, webhooks', () => {
			const resourceProperty = node.description.properties?.find(
				(p) => p.name === 'resource',
			);

			if (resourceProperty?.options) {
				const resources = (resourceProperty.options as any[]).map(
					(opt) => opt.value,
				);
				expect(resources).toContain('pix');
				expect(resources).toContain('plans');
				expect(resources).toContain('subscriptions');
				expect(resources).toContain('webhooks');
			}
		});

		it('NÃO deve ter recurso recurringPayments', () => {
			const resourceProperty = node.description.properties?.find(
				(p) => p.name === 'resource',
			);

			if (resourceProperty?.options) {
				const resources = (resourceProperty.options as any[]).map(
					(opt) => opt.value,
				);
				expect(resources).not.toContain('recurringPayments');
			}
		});
	});

	describe('Output Normalizado', () => {
		it('deve incluir provider e type no output do PIX', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'pix',
						operation: 'create',
						amount: 10.50,
						description: 'Teste',
						payerEmail: 'test@example.com',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				{
					id: '123456789',
					status: 'pending',
					transaction_amount: 10.50,
					currency_id: 'BRL',
					description: 'Teste',
					payment_method_id: 'pix',
					payer: { email: 'test@example.com' },
					point_of_interaction: {
						transaction_data: {
							qr_code: '00020126...',
							qr_code_base64: 'iVBORw0KGgo...',
						},
					},
					date_created: '2024-01-01T12:00:00.000-03:00',
				},
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.provider).toBe('mercado_pago');
			expect(result[0][0].json.type).toBe('payment');
		});

		it('deve incluir provider e type no output de Subscription', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'create',
						planId: 'plan-123',
						payerEmail: 'test@example.com',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				{
					id: 'sub-123',
					status: 'authorized',
					preapproval_plan_id: 'plan-123',
					payer_email: 'test@example.com',
					date_created: '2024-01-01T12:00:00.000-03:00',
				},
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.provider).toBe('mercado_pago');
			expect(result[0][0].json.type).toBe('subscription');
		});

		it('deve incluir provider e type no output de Plan', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'plans',
						operation: 'create',
						reason: 'Plano Pro',
						amount: 99.99,
						frequency: 1,
						frequencyType: 'months',
						currencyId: 'BRL',
						backUrl: 'https://example.com',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				{
					id: 'plan-123',
					status: 'active',
					reason: 'Plano Pro',
					auto_recurring: {
						transaction_amount: 99.99,
						frequency: 1,
						frequency_type: 'months',
						currency_id: 'BRL',
					},
					date_created: '2024-01-01T12:00:00.000-03:00',
				},
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.provider).toBe('mercado_pago');
			expect(result[0][0].json.type).toBe('plan');
		});
	});

	describe('PIX - Formato Decimal', () => {
		it('deve enviar transaction_amount em formato decimal (não centavos)', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'pix',
						operation: 'create',
						amount: 49.90,
						description: 'Teste',
						payerEmail: 'test@example.com',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				{
					id: '123456789',
					status: 'pending',
					transaction_amount: 49.90,
				},
			);

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			const callArgs =
				mockExecuteFunctions.helpers.requestWithAuthentication.call
					.mock.calls[0];
			// Deve enviar em formato decimal, não centavos
			expect(callArgs[2].body.transaction_amount).toBe(49.90);
			expect(callArgs[2].body.transaction_amount).not.toBe(4990);
		});
	});
});

