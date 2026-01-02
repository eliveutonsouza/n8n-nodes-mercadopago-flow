/**
 * Testes de integração para execução do node
 */

import { PaymentMercadoPago } from '../../archive/legacy/nodes/PaymentMercadoPago/PaymentMercadoPago.node';
import { createMockExecuteFunctions } from '../mocks/n8n-mocks';
import type { MockExecuteFunctions } from '../mocks/n8n-mocks';

describe('Node Execution', () => {
	let node: PaymentMercadoPago;
	let mockExecuteFunctions: MockExecuteFunctions;

	beforeEach(() => {
		node = new PaymentMercadoPago();
		mockExecuteFunctions = createMockExecuteFunctions();
	});

	describe('Resource Handler', () => {
		it('deve lançar erro para resource não suportado', async () => {
			// Arrange
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'invalidResource',
						operation: 'create',
					};
					return params[name];
				},
			);

			// Act & Assert
			await expect(
				node.execute.call(mockExecuteFunctions as any),
			).rejects.toThrow('não é suportado');
		});

		it('deve processar múltiplos itens de entrada', async () => {
			// Arrange
			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { resource: 'pix', operation: 'create' } },
				{ json: { resource: 'pix', operation: 'create' } },
			]);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(name: string, itemIndex: number) => {
					const params: { [key: string]: any }[] = [
						{
							resource: 'pix',
							operation: 'create',
							amount: 10.50,
							description: 'Teste 1',
							payerEmail: 'test1@example.com',
						},
						{
							resource: 'pix',
							operation: 'create',
							amount: 20.50,
							description: 'Teste 2',
							payerEmail: 'test2@example.com',
						},
					];
					return params[itemIndex][name];
				},
			);

			mockExecuteFunctions.helpers.requestWithAuthentication.call
				.mockResolvedValueOnce({
					id: '123',
					status: 'pending',
					transaction_amount: 10.50,
				})
				.mockResolvedValueOnce({
					id: '456',
					status: 'pending',
					transaction_amount: 20.50,
				});

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0].length).toBe(2);
			expect(result[0][0].json.id).toBe('123');
			expect(result[0][1].json.id).toBe('456');
		});
	});

	describe('Error Handling', () => {
		it('deve usar continueOnFail quando configurado', async () => {
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

			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.requestWithAuthentication.call.mockRejectedValue(
				new Error('Erro de teste'),
			);

			// Act
			const result = await node.execute.call(
				mockExecuteFunctions as any,
			);

			// Assert
			expect(result[0][0].json.error).toBeDefined();
			expect(result[0][0].json.status).toBe(500);
		});
	});
});

