/**
 * Testes de integração para operações de Customers
 */

import { CustomersResource } from '../../nodes/MercadoPago/resources/CustomersResource';
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

describe('CustomersResource Integration Tests', () => {
	let resource: CustomersResource;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockCustomer = {
		id: '123456789',
		email: 'test@example.com',
		first_name: 'Test',
		last_name: 'User',
		identification: {
			type: 'CPF',
			number: '12345678901',
		},
		phone: {
			area_code: '11',
			number: '987654321',
		},
		date_created: '2024-01-01T12:00:00.000Z',
		date_last_updated: '2024-01-01T12:00:00.000Z',
	};

	beforeEach(() => {
		resource = new CustomersResource();
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
		it('deve criar cliente com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					email: 'test@example.com',
					firstName: 'Test',
					lastName: 'User',
					phoneAreaCode: '11',
					phoneNumber: '987654321',
					identificationType: 'CPF',
					identificationNumber: '12345678901',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockCustomer);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'customers');

			// Assert
			expect(result).toEqual(mockCustomer);
			expect(apiRequest).toHaveBeenCalledWith(
				'POST',
				'/v1/customers',
				expect.objectContaining({
					email: 'test@example.com',
					first_name: 'Test',
					last_name: 'User',
				})
			);
		});

		it('deve validar email inválido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					email: 'invalid-email',
				};
				return params[name] ?? '';
			});

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'create', 'customers')
			).rejects.toThrow('Email inválido');
		});
	});

	describe('get', () => {
		it('deve buscar cliente por ID com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '123456789',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue(mockCustomer);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'customers');

			// Assert
			expect(result).toEqual(mockCustomer);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/customers/123456789'
			);
		});

		it('deve lançar erro quando customerId não é fornecido', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation(() => '');

			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'get', 'customers')
			).rejects.toThrow('ID do cliente é obrigatório');
		});
	});

	describe('update', () => {
		it('deve atualizar cliente com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '123456789',
					firstName: 'Updated',
					lastName: 'Name',
				};
				return params[name] ?? '';
			});

			const updatedCustomer = { ...mockCustomer, first_name: 'Updated', last_name: 'Name' };
			(apiRequest as jest.Mock).mockResolvedValue(updatedCustomer);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'update', 'customers');

			// Assert
			expect(result).toEqual(updatedCustomer);
			expect(apiRequest).toHaveBeenCalledWith(
				'PUT',
				'/v1/customers/123456789',
				expect.objectContaining({
					first_name: 'Updated',
					last_name: 'Name',
				})
			);
		});
	});

	describe('delete', () => {
		it('deve deletar cliente com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					customerId: '123456789',
				};
				return params[name] ?? '';
			});

			(apiRequest as jest.Mock).mockResolvedValue({});

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'delete', 'customers');

			// Assert
			expect(result).toEqual({});
			expect(apiRequest).toHaveBeenCalledWith(
				'DELETE',
				'/v1/customers/123456789'
			);
		});
	});

	describe('list', () => {
		it('deve listar clientes com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					limit: 50,
				};
				return params[name] ?? '';
			});

			const mockResponse = {
				results: [mockCustomer],
				paging: {
					total: 1,
					limit: 50,
				},
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'list', 'customers');

			// Assert
			expect(result).toEqual(mockResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/customers/search',
				undefined,
				expect.objectContaining({
					limit: 50,
				})
			);
		});
	});

	describe('search', () => {
		it('deve buscar clientes por email com sucesso', async () => {
			// Arrange
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
				const params: { [key: string]: any } = {
					email: 'test@example.com',
					limit: 50,
				};
				return params[name] ?? '';
			});

			const mockResponse = {
				results: [mockCustomer],
				paging: {
					total: 1,
					limit: 50,
				},
			};

			(apiRequest as jest.Mock).mockResolvedValue(mockResponse);

			// Act
			const result = await resource.execute(mockExecuteFunctions as IExecuteFunctions, 'search', 'customers');

			// Assert
			expect(result).toEqual(mockResponse);
			expect(apiRequest).toHaveBeenCalledWith(
				'GET',
				'/v1/customers/search',
				undefined,
				expect.objectContaining({
					email: 'test@example.com',
				})
			);
		});
	});

	describe('error handling', () => {
		it('deve lançar erro para operação não suportada', async () => {
			// Act & Assert
			await expect(
				resource.execute(mockExecuteFunctions as IExecuteFunctions, 'invalid', 'customers')
			).rejects.toThrow('Operação "invalid" não é suportada');
		});
	});
});

