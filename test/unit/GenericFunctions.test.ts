/**
 * Testes unitários para GenericFunctions.ts
 */

import { apiRequest, buildUrl, buildQueryString } from '../../nodes/MercadoPago/GenericFunctions';
import { IExecuteFunctions } from 'n8n-workflow';

describe('GenericFunctions', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	beforeEach(() => {
		mockExecuteFunctions = {
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'TEST-123456789-123456-abcdef-123456789-abcdef',
				baseUrl: 'https://api.mercadopago.com',
			}),
			helpers: {
				request: jest.fn(),
			} as any,
		};
	});

	describe('apiRequest', () => {
		it('deve fazer requisição GET com sucesso', async () => {
			const mockResponse = { id: '123', status: 'approved' };
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await apiRequest.call(
				mockExecuteFunctions as any,
				'GET',
				'/v1/payments/123'
			);

			expect(result).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: 'https://api.mercadopago.com/v1/payments/123',
					headers: expect.objectContaining({
						'Authorization': 'Bearer TEST-123456789-123456-abcdef-123456789-abcdef',
						'Content-Type': 'application/json',
					}),
					json: true,
				})
			);
		});

		it('deve fazer requisição POST com body', async () => {
			const mockResponse = { id: '456', status: 'pending' };
			const requestBody = { transaction_amount: 100, description: 'Test' };
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await apiRequest.call(
				mockExecuteFunctions as any,
				'POST',
				'/v1/payments',
				requestBody
			);

			expect(result).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://api.mercadopago.com/v1/payments',
					body: requestBody,
					headers: expect.objectContaining({
						'Authorization': 'Bearer TEST-123456789-123456-abcdef-123456789-abcdef',
					}),
				})
			);
		});

		it('deve fazer requisição PUT com body', async () => {
			const mockResponse = { id: '789', status: 'updated' };
			const requestBody = { status: 'active' };
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await apiRequest.call(
				mockExecuteFunctions as any,
				'PUT',
				'/v1/customers/789',
				requestBody
			);

			expect(result).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'PUT',
					body: requestBody,
				})
			);
		});

		it('deve fazer requisição DELETE', async () => {
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue({});

			const result = await apiRequest.call(
				mockExecuteFunctions as any,
				'DELETE',
				'/v1/customers/123'
			);

			expect(result).toEqual({});
			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'DELETE',
				})
			);
		});

		it('deve fazer requisição PATCH', async () => {
			const mockResponse = { id: '123', status: 'patched' };
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue(mockResponse);

			const result = await apiRequest.call(
				mockExecuteFunctions as any,
				'PATCH',
				'/v1/payments/123',
				{ status: 'approved' }
			);

			expect(result).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'PATCH',
				})
			);
		});

		it('deve usar baseUrl padrão quando não fornecido', async () => {
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				accessToken: 'TEST-TOKEN',
			});
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue({});

			await apiRequest.call(
				mockExecuteFunctions as any,
				'GET',
				'/v1/payments'
			);

			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					url: 'https://api.mercadopago.com/v1/payments',
				})
			);
		});

		it('deve usar baseUrl customizado quando fornecido', async () => {
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				accessToken: 'TEST-TOKEN',
				baseUrl: 'https://api-custom.mercadopago.com',
			});
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue({});

			await apiRequest.call(
				mockExecuteFunctions as any,
				'GET',
				'/v1/payments'
			);

			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					url: 'https://api-custom.mercadopago.com/v1/payments',
				})
			);
		});

		it('deve adicionar query string parameters', async () => {
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue({});

			await apiRequest.call(
				mockExecuteFunctions as any,
				'GET',
				'/v1/payments',
				undefined,
				{ status: 'approved', limit: 10 }
			);

			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					qs: { status: 'approved', limit: 10 },
				})
			);
		});

		it('deve adicionar headers customizados', async () => {
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue({});

			await apiRequest.call(
				mockExecuteFunctions as any,
				'GET',
				'/v1/payments',
				undefined,
				undefined,
				{ 'X-Custom-Header': 'custom-value' }
			);

			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						'X-Custom-Header': 'custom-value',
					}),
				})
			);
		});

		it('deve remover leading slash do endpoint', async () => {
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockResolvedValue({});

			await apiRequest.call(
				mockExecuteFunctions as any,
				'GET',
				'/v1/payments'
			);

			expect(mockExecuteFunctions.helpers!.request).toHaveBeenCalledWith(
				expect.objectContaining({
					url: 'https://api.mercadopago.com/v1/payments',
				})
			);
		});

		it('deve tratar erro da API', async () => {
			const error = {
				response: {
					status: 400,
					data: {
						message: 'Bad request',
						cause: [{ code: 'invalid_field', description: 'Invalid amount' }],
					},
				},
			};
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockRejectedValue(error);

			await expect(
				apiRequest.call(mockExecuteFunctions as any, 'POST', '/v1/payments', {})
			).rejects.toThrow('Bad request (Status HTTP: 400). Causas: Invalid amount');
		});

		it('deve lançar erro quando accessToken não está presente', async () => {
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({});

			await expect(
				apiRequest.call(mockExecuteFunctions as any, 'GET', '/v1/payments')
			).rejects.toThrow('Access Token é obrigatório');
		});

		it('deve tratar erro de rede', async () => {
			const error = {
				request: {},
				message: 'Network error',
			};
			(mockExecuteFunctions.helpers!.request as jest.Mock).mockRejectedValue(error);

			await expect(
				apiRequest.call(mockExecuteFunctions as any, 'GET', '/v1/payments')
			).rejects.toThrow('Erro de conexão com a API do Mercado Pago');
		});
	});

	describe('buildUrl', () => {
		it('deve substituir path parameters corretamente', () => {
			const url = buildUrl('/v1/payments/:id', { id: '123' });
			expect(url).toBe('/v1/payments/123');
		});

		it('deve substituir múltiplos path parameters', () => {
			const url = buildUrl('/v1/customers/:customer_id/cards/:card_id', {
				customer_id: '456',
				card_id: '789',
			});
			expect(url).toBe('/v1/customers/456/cards/789');
		});

		it('deve converter números para string', () => {
			const url = buildUrl('/v1/payments/:id', { id: 123 });
			expect(url).toBe('/v1/payments/123');
		});

		it('deve manter URL sem parâmetros', () => {
			const url = buildUrl('/v1/payments', {});
			expect(url).toBe('/v1/payments');
		});
	});

	describe('buildQueryString', () => {
		it('deve construir query string simples', () => {
			const qs = buildQueryString({ status: 'approved', limit: 10 });
			expect(qs).toBe('?status=approved&limit=10');
		});

		it('deve ignorar valores undefined, null e vazios', () => {
			const qs = buildQueryString({
				status: 'approved',
				limit: undefined,
				offset: null,
				empty: '',
			});
			expect(qs).toBe('?status=approved');
		});

		it('deve tratar arrays corretamente', () => {
			const qs = buildQueryString({ status: ['approved', 'pending'] });
			expect(qs).toBe('?status=approved&status=pending');
		});

		it('deve retornar string vazia quando não há parâmetros válidos', () => {
			const qs = buildQueryString({});
			expect(qs).toBe('');
		});

		it('deve fazer encode de valores especiais', () => {
			const qs = buildQueryString({ search: 'test & value' });
			expect(qs).toBe('?search=test%20%26%20value');
		});
	});
});

