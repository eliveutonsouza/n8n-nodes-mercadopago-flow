/**
 * Testes de integração para tratamento de erros em Assinaturas
 */

import { PaymentMercadoPago } from '../../nodes/PaymentMercadoPago/PaymentMercadoPago.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Subscriptions Error Handling', () => {
	let node: PaymentMercadoPago;
	let mockExecuteFunctions: MockExecuteFunctions;

	beforeEach(() => {
		node = new PaymentMercadoPago();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createSubscription - Tratamento de Erros', () => {
		it('deve tratar erro quando planId está vazio', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'create',
						planId: '',
						payerEmail: 'test@example.com',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID do Plano');
		});

		it('deve tratar erro quando payerEmail está vazio', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'create',
						planId: 'plan-123',
						payerEmail: '',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('E-mail do pagador');
		});

		it('deve tratar erro 404 ao consultar assinatura inexistente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'get',
						subscriptionId: 'inexistente-123',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockRejectedValue(
				{
					response: {
						status: 404,
						data: {
							message: 'Not found',
							error: 'not_found',
						},
					},
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Assinatura não encontrada');
		});

		it('deve tratar erro ao pausar assinatura inexistente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'pause',
						subscriptionId: 'inexistente-123',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockRejectedValue(
				{
					response: {
						status: 404,
						data: {
							message: 'Not found',
						},
					},
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Erro ao pausar assinatura');
		});

		it('deve tratar erro ao retomar assinatura inexistente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'resume',
						subscriptionId: 'inexistente-123',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockRejectedValue(
				{
					response: {
						status: 404,
						data: {
							message: 'Not found',
						},
					},
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Erro ao retomar assinatura');
		});

		it('deve tratar erro ao cancelar assinatura inexistente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'cancel',
						subscriptionId: 'inexistente-123',
					};
					return params[name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockRejectedValue(
				{
					response: {
						status: 404,
						data: {
							message: 'Not found',
						},
					},
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Erro ao cancelar assinatura');
		});
	});

	describe('getSubscription - Validações', () => {
		it('deve validar subscriptionId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'get',
						subscriptionId: '',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID da assinatura é obrigatório');
		});
	});

	describe('pauseSubscription - Validações', () => {
		it('deve validar subscriptionId obrigatório para pausar', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'pause',
						subscriptionId: '',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID da assinatura é obrigatório para pausar');
		});
	});

	describe('resumeSubscription - Validações', () => {
		it('deve validar subscriptionId obrigatório para retomar', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'resume',
						subscriptionId: '',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID da assinatura é obrigatório para retomar');
		});
	});

	describe('cancelSubscription - Validações', () => {
		it('deve validar subscriptionId obrigatório para cancelar', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'subscriptions',
						operation: 'cancel',
						subscriptionId: '',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID da assinatura é obrigatório para cancelar');
		});
	});
});

