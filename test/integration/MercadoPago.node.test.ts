/**
 * Testes de integração para o node principal MercadoPago
 */

import { MercadoPago } from '../../nodes/MercadoPago/MercadoPago.node';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

// Mock do apiRequest usado pelos recursos
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

describe('MercadoPago Node', () => {
	let node: MercadoPago;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new MercadoPago();
		mockExecuteFunctions = {
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'TEST-TOKEN',
				baseUrl: 'https://api.mercadopago.com',
			}),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				request: jest.fn(),
			} as any,
		};
		jest.clearAllMocks();
	});

	describe('Node Description', () => {
		it('deve ter displayName "Mercado Pago"', () => {
			expect(node.description.displayName).toBe('Mercado Pago');
		});

		it('deve ter name "mercadoPago"', () => {
			expect(node.description.name).toBe('mercadoPago');
		});

		it('deve ter credentials configuradas', () => {
			expect(node.description.credentials).toBeDefined();
			expect(node.description.credentials?.length).toBeGreaterThan(0);
			expect(node.description.credentials?.[0].name).toBe('mercadoPagoApi');
		});
	});

	describe('Resource Handler', () => {
		it('deve lançar erro para resource não suportado', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'invalidResource',
						operation: 'create',
					};
					return params[name];
				},
			);

			await expect(
				node.execute.call(mockExecuteFunctions as IExecuteFunctions),
			).rejects.toThrow('não é suportado');
		});

		it('deve processar resource "pix" corretamente', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'pix',
						operation: 'create',
						amount: 10.50,
						description: 'Teste',
						payerEmail: 'test@example.com',
						payerDocument: '12345678901',
					};
					return params[name];
				},
			);

			(apiRequest as jest.Mock).mockResolvedValue({
				id: '123',
				status: 'pending',
				transaction_amount: 10.50,
				currency_id: 'BRL',
				date_created: '2024-01-01T12:00:00.000-03:00',
			});

			const result = await node.execute.call(
				mockExecuteFunctions as IExecuteFunctions,
			);

			expect(result[0][0].json).toHaveProperty('provider', 'mercado_pago');
			expect(result[0][0].json).toHaveProperty('type', 'payment');
			expect(result[0][0].json).toHaveProperty('id', '123');
		});
	});

	describe('Error Handling', () => {
		it('deve tratar erro ao obter parâmetros', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				() => {
					throw new Error('Could not get parameter "resource"');
				},
			);

			await expect(
				node.execute.call(mockExecuteFunctions as IExecuteFunctions),
			).rejects.toThrow('Erro ao obter parâmetros do node');
		});

		it('deve usar continueOnFail quando configurado', async () => {
			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(true);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				() => {
					throw new Error('Test error');
				},
			);

			const result = await node.execute.call(
				mockExecuteFunctions as IExecuteFunctions,
			);

			expect(result[0][0].json).toHaveProperty('error');
			expect(result[0][0].json).toHaveProperty('status');
		});

		it('deve tratar erros de handler com contexto detalhado', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'pix',
						operation: 'create',
					};
					return params[name];
				},
			);

			const handlerError: any = new Error('Bad request - parameter obrigatório');
			handlerError.message = 'Bad request - parameter obrigatório';

			(apiRequest as jest.Mock).mockRejectedValue(handlerError);

			await expect(
				node.execute.call(mockExecuteFunctions as IExecuteFunctions),
			).rejects.toThrow();
		});

		it('deve tratar erros de API com detalhes', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
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

			const apiError: any = new Error('API Error');
			apiError.response = {
				status: 400,
				data: {
					message: 'Invalid request',
					cause: [
						{ description: 'Campo obrigatório faltando' },
						{ code: 'INVALID_FIELD' },
					],
				},
			};

			(apiRequest as jest.Mock).mockRejectedValue(apiError);

			await expect(
				node.execute.call(mockExecuteFunctions as IExecuteFunctions),
			).rejects.toThrow('API Error');
		});
	});

	describe('Multiple Items', () => {
		it('deve processar múltiplos itens de entrada', async () => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([
				{ json: { item: 1 } },
				{ json: { item: 2 } },
			]);

			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(name: string, itemIndex: number) => {
					const params: { [key: string]: any }[] = [
						{
							resource: 'pix',
							operation: 'create',
							amount: 10.50,
							description: 'Teste 1',
							payerEmail: 'test1@example.com',
							payerDocument: '12345678901',
						},
						{
							resource: 'pix',
							operation: 'create',
							amount: 20.50,
							description: 'Teste 2',
							payerEmail: 'test2@example.com',
							payerDocument: '12345678902',
						},
					];
					return params[itemIndex][name];
				},
			);

			(apiRequest as jest.Mock)
				.mockResolvedValueOnce({
					id: '123',
					status: 'pending',
					transaction_amount: 10.50,
					currency_id: 'BRL',
					date_created: '2024-01-01T12:00:00.000-03:00',
				})
				.mockResolvedValueOnce({
					id: '456',
					status: 'pending',
					transaction_amount: 20.50,
					currency_id: 'BRL',
					date_created: '2024-01-01T12:00:00.000-03:00',
				});

			const result = await node.execute.call(
				mockExecuteFunctions as IExecuteFunctions,
			);

			expect(result[0].length).toBe(2);
			expect(result[0][0].json.id).toBe('123');
			expect(result[0][1].json.id).toBe('456');
		});
	});

	describe('Response Normalization', () => {
		it('deve normalizar resposta do PIX corretamente', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(name: string) => {
					const params: { [key: string]: any } = {
						resource: 'pix',
						operation: 'create',
						amount: 10.50,
						description: 'Teste',
						payerEmail: 'test@example.com',
						payerDocument: '12345678901',
					};
					return params[name];
				},
			);

			(apiRequest as jest.Mock).mockResolvedValue({
				id: '123',
				status: 'pending',
				transaction_amount: 10.50,
				currency_id: 'BRL',
				description: 'Teste',
				payer: { email: 'test@example.com' },
				point_of_interaction: {
					transaction_data: {
						qr_code: '00020126...',
						qr_code_base64: 'iVBORw0KGgo...',
					},
				},
				date_created: '2024-01-01T12:00:00.000-03:00',
			});

			const result = await node.execute.call(
				mockExecuteFunctions as IExecuteFunctions,
			);

			expect(result[0][0].json).toMatchObject({
				provider: 'mercado_pago',
				type: 'payment',
				id: '123',
				status: 'pending',
				amount: 10.50,
				currency: 'BRL',
				qrCode: '00020126...',
				qrCodeBase64: 'iVBORw0KGgo...',
			});
		});
	});
});

