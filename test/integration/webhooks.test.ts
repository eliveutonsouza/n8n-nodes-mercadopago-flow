/**
 * Testes de integração para operações de Webhooks
 */

import { PixPayment } from '../../nodes/PixPayment/PixPayment.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import {
	mockWebhookResponse,
} from '../mocks/mercado-pago-mocks';
import { mockWebhookData } from '../mocks/fixtures';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Webhooks Integration Tests', () => {
	let node: PixPayment;
	let mockExecuteFunctions: MockExecuteFunctions;
	const baseUrl = 'https://api.mercadopago.com';

	beforeEach(() => {
		node = new PixPayment();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('registerWebhook', () => {
		it('deve registrar webhook com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'webhooks',
					operation: 'register',
					url: mockWebhookData.url,
					events: mockWebhookData.events,
					description: mockWebhookData.description,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockWebhookResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(result[0][0].json.id).toBe(mockWebhookResponse.id);
			expect(result[0][0].json.url).toBe(mockWebhookData.url);
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'POST',
					url: `${baseUrl}/v1/webhooks`,
					body: expect.objectContaining({
						url: mockWebhookData.url,
						events: mockWebhookData.events,
					}),
				}),
			);
		});

		it('deve validar URL inválida', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'webhooks',
					operation: 'register',
					url: 'invalid-url',
					events: ['payment'],
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('URL do webhook deve ser uma URL válida');
		});

		it('deve usar eventos padrão quando não fornecidos', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'webhooks',
					operation: 'register',
					url: 'https://example.com/webhook',
					events: [],
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockWebhookResponse,
			);

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			const callArgs = mockExecuteFunctions.helpers.requestWithAuthentication.call.mock.calls[0];
			expect(callArgs[2].body.events).toEqual(['payment']);
		});
	});

	describe('getWebhook', () => {
		it('deve consultar webhook existente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'webhooks',
					operation: 'get',
					webhookId: '123456',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockWebhookResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result).toBeDefined();
			expect(result[0][0].json.id).toBe(mockWebhookResponse.id);
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				expect.anything(),
				'pixPaymentApi',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/v1/webhooks/123456`,
				}),
			);
		});
	});

	describe('listWebhooks', () => {
		it('deve listar webhooks com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'webhooks',
					operation: 'list',
				};
				return params[name];
			});

			const listResponse = {
				results: [mockWebhookResponse],
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
					url: `${baseUrl}/v1/webhooks`,
				}),
			);
		});
	});

	describe('deleteWebhook', () => {
		it('deve excluir webhook com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'webhooks',
					operation: 'delete',
					webhookId: '123456',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue({});

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
					method: 'DELETE',
					url: `${baseUrl}/v1/webhooks/123456`,
				}),
			);
		});
	});
});

