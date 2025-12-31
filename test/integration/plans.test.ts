import { PaymentMercadoPago } from '../../nodes/PaymentMercadoPago/PaymentMercadoPago.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import {
	mockPlanResponse,
	mockPlanListResponse,
} from '../mocks/mercado-pago-mocks';
import { mockPlanData } from '../mocks/fixtures';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Plans Integration Tests', () => {
	let node: PaymentMercadoPago;
	let mockExecuteFunctions: MockExecuteFunctions;
	const baseUrl = 'https://api.mercadopago.com';

	beforeEach(() => {
		node = new PaymentMercadoPago();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('createPlan', () => {
		it('deve criar plano com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: mockPlanData.amount,
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
					currencyId: 'BRL',
					backUrl: 'https://www.mercadopago.com.br',
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanResponse,
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'paymentMercadoPagoAPI',
				expect.objectContaining({
					method: 'POST',
					url: `${baseUrl}/preapproval_plan`,
					body: expect.objectContaining({
						reason: mockPlanData.reason,
						auto_recurring: expect.objectContaining({
							frequency: mockPlanData.frequency,
							frequency_type: mockPlanData.frequencyType,
							transaction_amount: mockPlanData.amount,
							currency_id: 'BRL',
						}),
					}),
				}),
			);
			expect(result[0][0].json.id).toBe(mockPlanResponse.id);
			expect(result[0][0].json.status).toBe(mockPlanResponse.status);
			expect(result[0][0].json.amount).toBe(mockPlanData.amount);
		});

		it('deve validar valor menor ou igual a zero', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: 0, // Invalid amount
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Valor do plano deve ser maior que zero');
		});

		it('deve validar frequência menor ou igual a zero', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: mockPlanData.amount,
					frequency: 0, // Invalid frequency
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Frequência deve ser maior que zero');
		});

		it('deve validar tipo de frequência inválido', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: mockPlanData.amount,
					frequency: mockPlanData.frequency,
					frequencyType: 'invalid', // Invalid frequency type
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Tipo de frequência deve ser "days" ou "months"');
		});

		it('deve validar nome do plano obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: '', // Empty reason
					amount: mockPlanData.amount,
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('Nome do plano é obrigatório');
		});

		it('deve enviar valor em formato decimal', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: 12.34,
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanResponse,
			);

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'paymentMercadoPagoAPI',
				expect.objectContaining({
					body: expect.objectContaining({
						auto_recurring: expect.objectContaining({
							transaction_amount: 12.34,
						}),
					}),
				}),
			);
		});

		it('deve converter vírgula para ponto decimal no valor', async () => {
			// Arrange - simula valor com vírgula como string
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'create',
					reason: mockPlanData.reason,
					amount: '14,9', // Valor com vírgula como string
					frequency: mockPlanData.frequency,
					frequencyType: mockPlanData.frequencyType,
				};
				return params[name] !== undefined ? params[name] : defaultValue;
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue({
				...mockPlanResponse,
				auto_recurring: {
					...mockPlanResponse.auto_recurring,
					transaction_amount: 14.9,
				},
			});

			// Act
			await node.execute.call(mockExecuteFunctions as any);

			// Assert - verifica que a vírgula foi convertida para ponto e enviada em formato decimal
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'paymentMercadoPagoAPI',
				expect.objectContaining({
					body: expect.objectContaining({
						auto_recurring: expect.objectContaining({
							transaction_amount: 14.9,
						}),
					}),
				}),
			);
		});
	});

	describe('getPlan', () => {
		it('deve consultar plano existente', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'get',
					planId: mockPlanResponse.id,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanResponse,
			);

			// Act
			const result = await node.execute.call(mockExecuteFunctions as any);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'paymentMercadoPagoAPI',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval_plan/${mockPlanResponse.id}`,
				}),
			);
			expect(result[0][0].json.id).toBe(mockPlanResponse.id);
			expect(result[0][0].json.status).toBe(mockPlanResponse.status);
		});

		it('deve validar planId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'get',
					planId: '', // Missing planId
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID do plano é obrigatório');
		});
	});

	describe('listPlans', () => {
		it('deve listar planos com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'list',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue(
				mockPlanListResponse,
			);

			// Act
			const result = await node.execute.call(mockExecuteFunctions as any);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'paymentMercadoPagoAPI',
				expect.objectContaining({
					method: 'GET',
					url: `${baseUrl}/preapproval_plan/search`,
				}),
			);
			const rawData = result[0][0].json.raw as any;
			expect(rawData.results).toBeDefined();
			expect(rawData.results.length).toBe(1);
			expect(rawData.results[0].id).toBe(mockPlanResponse.id);
		});
	});

	describe('updatePlan', () => {
		it('deve atualizar plano com sucesso', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'update',
					planId: mockPlanResponse.id,
					updateReason: 'Plano Atualizado',
					updateAmount: 149.99,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockResolvedValue({
				...mockPlanResponse,
				reason: 'Plano Atualizado',
				auto_recurring: {
					...mockPlanResponse.auto_recurring,
					transaction_amount: 149.99,
				},
			});

			// Act
			const result = await node.execute.call(mockExecuteFunctions as any);

			// Assert
			expect(mockExecuteFunctions.helpers.requestWithAuthentication.call).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'paymentMercadoPagoAPI',
				expect.objectContaining({
					method: 'PUT',
					url: `${baseUrl}/preapproval_plan/${mockPlanResponse.id}`,
					body: expect.objectContaining({
						reason: 'Plano Atualizado',
						auto_recurring: expect.objectContaining({
							transaction_amount: 149.99,
						}),
					}),
				}),
			);
			expect(result[0][0].json.id).toBe(mockPlanResponse.id);
		});

		it('deve validar planId obrigatório', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'update',
					planId: '', // Missing planId
					reason: 'Plano Atualizado',
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('ID do plano é obrigatório');
		});

		it('deve validar que pelo menos um campo deve ser fornecido para atualizar', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					resource: 'plans',
					operation: 'update',
					planId: mockPlanResponse.id,
					updateReason: '', // Empty reason
					updateAmount: 0, // Invalid amount
				};
				return params[name];
			});

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('É necessário fornecer pelo menos um campo para atualizar');
		});
	});
});

