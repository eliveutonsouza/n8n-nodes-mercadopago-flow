/**
 * Testes de integração para operações de Cards
 */

import { CardsResource } from '../../nodes/MercadoPago/resources/CardsResource';
import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../nodes/MercadoPago/GenericFunctions';

// Mock do apiRequest
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

describe('CardsResource Integration Tests', () => {
	let resource: CardsResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockCard = {
		id: '9392738686',
		customer_id: '1670445614-6R4OLYVlnY2C00',
		first_six_digits: '503175',
		last_four_digits: '0604',
		expiration_month: 11,
		expiration_year: 2025,
		cardholder: {
			name: 'APRO',
			identification: {
				type: 'DNI',
				number: '19119119100',
			},
		},
		payment_method: {
			id: 'master',
			name: 'Mastercard',
			payment_type_id: 'credit_card',
		},
		date_created: '2024-02-05T15:54:31.000-04:00',
		date_last_updated: '2024-02-05T15:54:31.000-04:00',
	};

	beforeEach(() => {
		resource = new CardsResource();
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'TEST-TOKEN',
				baseUrl: 'https://api.mercadopago.com',
			}),
			helpers: {
				request: jest.fn(),
			} as any,
		};
		jest.clearAllMocks();
	});

	describe('create', () => {
		it('deve criar cartão com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '1670445614-6R4OLYVlnY2C00',
					token: 'test-token-123',
					paymentMethodId: 'master',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockCard);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'cards');

			// Assert
			expect(result).toEqual(mockCard);
			expect(apiRequest).toHaveBeenCalledWith(
				'POST',
				expect.stringContaining('customers'),
				expect.objectContaining({
					token: 'test-token-123',
					payment_method_id: 'master',
				})
			);
		});

		it('deve lançar erro quando customerId não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => '');

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'cards')
			).rejects.toThrow('ID do cliente é obrigatório');
		});

		it('deve lançar erro quando token não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '1670445614-6R4OLYVlnY2C00',
				};
				return params[name] ?? '';
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'cards')
			).rejects.toThrow('Token do cartão é obrigatório');
		});
	});

	describe('get', () => {
		it('deve buscar cartão por ID com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '1670445614-6R4OLYVlnY2C00',
					cardId: '9392738686',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockCard);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'cards');

			// Assert
			expect(result).toEqual(mockCard);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/customers/1670445614-6R4OLYVlnY2C00/cards/9392738686'
			);
		});

		it('deve lançar erro quando cardId não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '1670445614-6R4OLYVlnY2C00',
				};
				return params[name] ?? '';
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'cards')
			).rejects.toThrow('ID do cartão é obrigatório');
		});
	});

	describe('delete', () => {
		it('deve deletar cartão com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '1670445614-6R4OLYVlnY2C00',
					cardId: '9392738686',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockCard);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'delete', 'cards');

			// Assert
			expect(result).toEqual(mockCard);
			expect(apiRequest).toHaveBeenCalledWith(
				'DELETE',
				'/v1/customers/1670445614-6R4OLYVlnY2C00/cards/9392738686'
			);
		});
	});

	describe('list', () => {
		it('deve listar cartões do cliente com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '1670445614-6R4OLYVlnY2C00',
				};
				return params[name] ?? '';
			});

			const mockResponse = [mockCard];

			(apiRequest as jest.Mock).mockResolvedValue(mockResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'cards');

			// Assert
			expect(result).toEqual(mockResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/customers/1670445614-6R4OLYVlnY2C00/cards'
			);
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'cards')
			).rejects.toThrow('Operação "invalid" não é suportada');
		});
	});
});

